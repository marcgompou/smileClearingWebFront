import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject,Observable, of, shareReplay, switchMap, tap} from 'rxjs';
import { Agence } from './agence.types';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AgenceService
{   
    private _agence: BehaviorSubject<Agence | null> = new BehaviorSubject(null);
    private _agences: BehaviorSubject<any | null> = new BehaviorSubject(null);

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
    get agences$(): Observable<any> {
        return this._agences.asObservable();
    }

    /**
     * Getter for client
     */
    get agence$(): Observable<Agence> {
        return this._agence.asObservable();
    }


    getAgences():Observable<any>{
        return this._httpClient.get<any>(`${environment.apiUrl}/agences/all`).pipe(
            shareReplay(1),
            tap((response) => {
                console.log(response);               
                this._agences.next(response);
                
            })
        );

    }


}
