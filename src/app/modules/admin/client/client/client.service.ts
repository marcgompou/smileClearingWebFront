import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError,Observable, of, switchMap, tap} from 'rxjs';
import { Client } from './client.types';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ClientService
{   
    private _clients: BehaviorSubject<Client[] | null> = new BehaviorSubject(null);
    private _client: BehaviorSubject<Client | null> = new BehaviorSubject(null);
    
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
     get clients$(): Observable<any> {
        return this._clients.asObservable();
    }

    /**
     * Getter for client
     */
    get client$(): Observable<Client> {
        return this._client.asObservable();
    }



    /**
     * Delete client
     * @param id 
     * @returns 
    //  */
 

}
