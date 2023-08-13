import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { environment } from 'environments/environment';
import { User } from '../user/user.types';

@Injectable()
export class AuthService
{
    private _authenticated: boolean = false;
    
    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string)
    {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string
    {
        return localStorage.getItem('accessToken') ?? '';
    }

    set mfaToken(token:string){

        localStorage.setItem('mfaToken', token);
    }
    
    get mfaToken(): string
    {
        return localStorage.getItem("mfaToken") ?? '';
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPasswordInit(email: string): Observable<any> {
        return this._httpClient.post(environment.apiUrl + 'auth/forgot-password/initiations', {
            username: email
        });
    }

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPasswordConfirm(email: string, code: string, newPassword: string): Observable<any> {
        return this._httpClient.post(environment.apiUrl + 'auth/forgot-password/confirmations', {
            username: email,
            newPassword: newPassword,
            confirmationCode: code
        });
    }
    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any>
    {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { username: string; password: string }): Observable<any> {
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }
         return this._httpClient.post(environment.apiUrl + '/Authentication/login', credentials)
        .pipe(
            switchMap((response: any) => {
                console.log('response', response);
                this.mfaToken=response.token;
                return of(response);
            })
        );
    }

    /**
     * Send MFA code
     *
     * @param credentials
     */
    changePasword(values): Observable<any> {
        console.log('changePasword--------------', values);
        return this._httpClient.post(environment.apiUrl + '/Authentication/ModificationPassword', values).pipe(
            switchMap((response: any) => {
                return this.handleLoginResponse(response);
            })
        );
    }

    /**
     * Configure MFA 
     *
     * @param values
     */
    // configureMFA(values): Observable<any> {
    //     return this._httpClient.post(environment.apiUrl + 'auth/mfa/configurations', values).pipe(
    //         switchMap((response: any) => {
    //             return this.handleLoginResponse111(response);
    //         })
    //     );
    // }

    /**
     * Send MFA code
     *
     * @param credentials
     */
    verifyMFA(credentials): Observable<any> {
        return this._httpClient.get(environment.apiUrl+ '/Authentication/login-2FA?code='+credentials,{withCredentials:true}).pipe(
            switchMap((response: any) => {
                console.log('response', response);
                return this.handleLoginResponse(response);
            })
        );
    }

    /**
     * Quand on se connecte, la réponse du serveur est traitée ici
     * @param response 
     * @returns 
     */
    handleLoginResponse(response): Observable<any> {
        console.log('handleLoginResponse1--------------', response);
        if (!response.challenge || response.challenge == "NEW_PASSWORD_REQUIRED" ) {
            // Store the access token in the local storage
            // I don't use access token add add custom fields to token I need them in my autorisation process
            this.accessToken = response.token;
            
            const decodedToken = AuthUtils._decodeToken(this.accessToken);
            localStorage.removeItem('mfaToken');

            // Set the authenticated flag to true
            this._authenticated = true;

            // Store the user on the user service
            // const user = response.body.user ;
            // user.roles = decodedToken['roles'];

            console.log("Token parse===>",decodedToken);

            this._userService.user = new User(decodedToken);
            

            // start session idle 
            //this.watchSession();

            // Return a new observable with the response
            
        }
       
        return of(response);
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        const token = "" +this.accessToken;
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('mfaToken');
        localStorage.removeItem('user');

        // Set the authenticated flag to false
        this._authenticated = false;

        // this._httpClient.post(environment.apiUrl + 'auth/logout', {})
        // .subscribe((response: any) => {
        //     console.log('response logout', response);
        // })

        // Return the observable
        return of(true);
    }

    forgotPassword(email: string): Observable<any>
    {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    unlockSession(credentials: { email: string; password: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }
    /**
     * Check the authentication status
     */
    check(): Observable<boolean>
    {
        console.log("this._authenticated ", this._authenticated );
        // Check if the user is logged in
        if ( this._authenticated )
        {
            return of(true);
        }

        // Check the access token availability
        if ( !this.accessToken )
        {
            return of(false);
        }

        // Check the access token expire date
        if ( AuthUtils.isTokenExpired(this.accessToken) )
        {
            return of(false);
        }
        else {
            this._authenticated = true;
            return of(true);
        }

        // If the access token exists and it didn't expire, sign in using it
        //return this.signInUsingToken();
    }
}
