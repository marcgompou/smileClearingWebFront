import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, ReplaySubject } from 'rxjs';
import { User } from 'app/core/user/user.types';
import { AuthUtils } from '../auth/auth.utils';

@Injectable({
    providedIn: 'root'
})
export class UserService
{
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * getter for id token
     */
    get idToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: User)
    {
        // Store the value
        this._user.next(value);
    }

    get user$(): Observable<User>
    {
        return this._user.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current logged in user data
     */
    get(): Observable<User>
    {
        console.log('decode id token')
        const decodedToken = AuthUtils._decodeToken(this.idToken);
        
        return new Observable<User>((subscriber) => {

            let rolesString =decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ?? null;
            if(rolesString==undefined||rolesString==null){
                rolesString="";
            }
            let user = {
                id:  decodedToken['id']!,
                nom:  decodedToken['nom']!,
                prenom:  decodedToken['prenom']!,
                email:  decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']!,
                roles: rolesString.split(",") ,
                fonction: decodedToken['fonction']!,
                changePassword:decodedToken["decodedToken"]=="True",
                idEntreprise : decodedToken['idEntreprise'],
                nomEntreprise : decodedToken['nomEntreprise']
            } as User;
            this._user.next(user);
            subscriber.next(user);
            subscriber.complete();
        })
    }
    /**
     * Get the current logged in user data
     */
    //  get(): Observable<User>
    //  {
    //      return this._httpClient.get<User>('api/common/user').pipe(
    //          tap((user) => {
    //              this._user.next(user);
    //          })
    //      );
    //  }

    /**
     * Update the user
     *
     * @param user
     */
    // update(user: User): Observable<any>
    // {
    //     return this._httpClient.patch<User>('api/common/user', {user}).pipe(
    //         map((response) => {
    //             this._user.next(response);
    //         })
    //     );
    // }
}
