import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError,Observable, of, switchMap, tap} from 'rxjs';
import { Agence } from './agence.types';
import { environment } from 'environments/environment';
//import { basicfilter } from './basicfilter';

@Injectable({
    providedIn: 'root'
})
export class AgenceService
{   
    private _agence: BehaviorSubject<Agence[] | null> = new BehaviorSubject(null);
   // private _client: BehaviorSubject<Agence | null> = new BehaviorSubject(null);
    
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
     * Getter for agence
     */
     get agence$(): Observable<any> {
        return this._agence.asObservable();
    }

    /**
     * Getter for client
     */
    // get client$(): Observable<Agence> {
    //     return this._client.asObservable();
    // }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods CRUD
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create client
     * @param agence 
     * @returns 
     */
    createAgence(agence: Agence): Observable<any> {
        return this._httpClient.post(
            `${environment.apiUrl}/agence`,
            agence
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
     * @param agence 
     * @returns 
     */
    update(id: string, agence: Agence): Observable<any> {
        return this._httpClient.put(
            `${environment.apiUrl}/agence/${id}`,
            agence
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
     * Get agence
     */
    get():Observable<any>
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
        return this._httpClient.get<any>(`${environment.apiUrl}/agence/${id}`).pipe(
            tap((response) => {
                this._agence.next(response);
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
        return this._httpClient.delete<any>(`${environment.apiUrl}/agence/${id}`).pipe(
            catchError((error) =>{
                throw error;
            }),
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

 //   search ()

}
