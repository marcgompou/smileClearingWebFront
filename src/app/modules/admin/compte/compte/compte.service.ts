import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError,Observable, of, switchMap, tap} from 'rxjs';
import { Compte } from './compte.types';
import { environment } from 'environments/environment';
import { Agence } from 'app/modules/admin/agence/agence/agence.types';

@Injectable({
    providedIn: 'root'
})
@Injectable()
export class CompteService
{   
    private _compte: BehaviorSubject<Compte[] | null> = new BehaviorSubject(null);
    private _client: BehaviorSubject<Compte | null> = new BehaviorSubject(null);
    
    private _agence: BehaviorSubject<Agence[] | null> = new BehaviorSubject(null);
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
     * Getter for compte
     */
     get compte$(): Observable<any> {
        return this._compte.asObservable();
    }

    /**
     * Getter for client
     */
    get client$(): Observable<Compte> {
        return this._client.asObservable();
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods CRUD
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create client
     * @param compte 
    
     * @returns 
     */
    createCompte( compte: Compte): Observable<any> {
        console.log('*------------------idEntreprise',compte.identreprise);
        return this._httpClient.post(
            `${environment.apiUrl}/compteClient`,
            compte
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
     * @param compte 
     * @returns 
     */
    update(id: string, compte: Compte): Observable<any> {
        return this._httpClient.put(
            `${environment.apiUrl}/compteClient/${id}`,
            compte
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
     * Get compte
     */
    get():Observable<any>
    {

        return this._httpClient.get<any>(`${environment.apiUrl}/compteClient`).pipe(
            tap((response) => {
                console.log('test======================================');
                console.log(response);
              //  response.sort((a,b)=>(a.creationDate<b.creationDate)? 1:-1);
               
                this._compte.next(response);
                
            })
        );
        //console.log(HttpClient);
    }


    getagence():Observable<any>
    {

        return this._httpClient.get<any>(`${environment.apiUrl}/agence`).pipe(
            tap((response) => {
                console.log('test======================================');
                console.log(response);
              //  response.sort((a,b)=>(a.creationDate<b.creationDate)? 1:-1);
               
                this._agence.next(response);
                
            })
        );
        //console.log(HttpClient);
    }
    /**
     * Get client by id
     * @param id 
     * @returns 
     */
    getById(id: string): Observable<any>
    {
        return this._httpClient.get<any>(`${environment.apiUrl}/compteClient/${id}`).pipe(
            tap((response) => {
                this._client.next(response);
            })
        );
    }

    /**
     * Delete client
     * @param id 
     * @returns 
     */
    delete(id: string): Observable<any>
    {
        return this._httpClient.delete<any>(`${environment.apiUrl}/compteClient/${id}`).pipe(
            catchError((error) =>{
                throw error;
            }),
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

}
