import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError,Observable, of, switchMap, tap} from 'rxjs';
import { Entreprise } from './client.types';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class EntrepriseService
{   
    private _entreprises: BehaviorSubject<Entreprise[] | null> = new BehaviorSubject(null);
    private _entreprise: BehaviorSubject<Entreprise | null> = new BehaviorSubject(null);
    
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
     * Getter for entreprises
     */
     get entreprises$(): Observable<any> {
        return this._entreprises.asObservable();
    }

    /**
     * Getter for client
     */
    get entreprise$(): Observable<Entreprise> {
        return this._entreprise.asObservable();
    }



    /**
     * Delete client
     * @param id 
     * @returns 
    //  */
 

}
