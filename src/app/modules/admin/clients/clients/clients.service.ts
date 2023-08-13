import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError,Observable, of, switchMap, tap} from 'rxjs';
import { Clients } from './clients.types';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ClientsService
{   
    private _clients: BehaviorSubject<Clients[] | null> = new BehaviorSubject(null);
    private _client: BehaviorSubject<Clients | null> = new BehaviorSubject(null);
    
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
     * Getter for clients
     */
     get clients$(): Observable<Clients[]> {
        return this._clients.asObservable();
    }

    /**
     * Getter for client
     */
    get client$(): Observable<Clients> {
        return this._client.asObservable();
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods CRUD
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create client
     * @param client 
     * @returns 
     */
    createClient(client: Clients): Observable<any> {
        return this._httpClient.post(
            `${environment.apiUrl}/clients`,
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
     * Update client
     * @param id 
     * @param client 
     * @returns 
     */
    updateClient(id: string, client: Clients): Observable<any> {
        return this._httpClient.put(
            `${environment.apiUrl}/clients/${id}`,
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
     * Get clients
     */
    getClients():Observable<any>
    {
        return this._httpClient.get<any>(`${environment.apiUrl}/clients`).pipe(
            tap((response) => {
                response.sort((a,b)=>(a.creationDate<b.creationDate)? 1:-1);
                this._clients.next(response);
            })
        );
    }

    /**
     * Get client by id
     * @param id 
     * @returns 
     */
    getClientById(id: string): Observable<any>
    {
        return this._httpClient.get<any>(`${environment.apiUrl}/clients/${id}`).pipe(
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
    deleteClient(id: string): Observable<any>
    {
        return this._httpClient.delete<any>(`${environment.apiUrl}/clients/${id}`).pipe(
            catchError((error) =>{
                throw error;
            }),
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

}
