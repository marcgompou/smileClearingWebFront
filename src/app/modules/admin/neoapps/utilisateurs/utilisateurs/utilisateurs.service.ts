import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError,Observable, of, switchMap, tap} from 'rxjs';
import { Utilisateurs } from './utilisateurs.types';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UtilisateursService
{   
    private _utilisateurs: BehaviorSubject<Utilisateurs[] | null> = new BehaviorSubject(null);
    // private _client: BehaviorSubject<Utilisateurs | null> = new BehaviorSubject(null);
    private _utilisateur: BehaviorSubject<Utilisateurs | null> = new BehaviorSubject(null);
    private _roles: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _entreprises: BehaviorSubject<any | null> = new BehaviorSubject(null);

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
     * Getter for utilisateurs
     */
    get utilisateurs$(): Observable<any> {
        return this._utilisateurs.asObservable();
    }

    get utilisateur$(): Observable<any> {
        return this._utilisateur.asObservable();
    }

    get entreprises$(): Observable<any>
    {
        return this._entreprises.asObservable();
    }

    
    // get client$(): Observable<Utilisateurs> {
    //     return this._client.asObservable();
    // }
    
    /**
     * Getter for client
     */
    get roles$(): Observable<Utilisateurs> {
        return this._roles.asObservable();
    }

     /**
     * Getter for client
     */

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods CRUD
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create client
     * @param utilisateur 
     * @returns 
     */
    createUtilisateur(utilisateur: any): Observable<any> {
        return this._httpClient.post(
            `${environment.apiUrl}/Authentication`,
            utilisateur
        ).pipe(
            catchError((error) => {
                throw error;
            }),
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    /**
     * Update client
     * @param id 
     * @param utilisateur 
     * @returns 
     */
    updateUtilisateur(id: string, client: Utilisateurs): Observable<any> {
        return this._httpClient.put(
            `${environment.apiUrl}/users/${id}`,
            client
        ).pipe(
            catchError((error) => {
                throw error;
            }),
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    /**
     * Get utilisateurs
     */
    getUtilisateurs():Observable<any>
    {

        return this._httpClient.get<any>(`${environment.apiUrl}/users`).pipe(
            tap((response) => {
                console.log('test======================================');
                console.log(response);
              //  response.sort((a,b)=>(a.creationDate<b.creationDate)? 1:-1);
               
                this._utilisateurs.next(response);
                
            })
        );
        //console.log(HttpClient);
    }


    /**
     * Get client by id
     * @param id 
     * @returns 
     */
    getUtilisateurById(id: string): Observable<any>
    {
        return this._httpClient.get<any>(`${environment.apiUrl}/users/${id}`).pipe(
            tap((response) => {
                this._utilisateur.next(response);
            })
        );
    }

    /**
     * Delete client
     * @param id 
     * @returns 
     */
    deleteUtilisateur(id: string): Observable<any>
    {
        return this._httpClient.delete<any>(`${environment.apiUrl}/user/${id}`).pipe(
            catchError((error) =>{
                throw error;
            }),
            switchMap((response: any) => {
                return of(response);
            })
        );
    }


    //User Roles
    getRoles():Observable<any>
    {
        return this._httpClient.get<any>(`${environment.apiUrl}/roles`).pipe(
            tap((response) => {
                console.log(response);               
                this._roles.next(response);
                
            })
        );
    }

    getEntreprises():Observable<any>{
        return this._httpClient.get<any>(`${environment.apiUrl}/entreprises/all`).pipe(
            tap((response) => {
                console.log(response);               
                this._entreprises.next(response);
                
            })
        );

    }
}
