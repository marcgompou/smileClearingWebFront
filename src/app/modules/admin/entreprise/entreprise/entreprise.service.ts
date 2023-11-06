import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject,Observable, of, shareReplay, switchMap, tap} from 'rxjs';
import { Entreprise } from './entreprise.types';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class EntrepriseService
{   
    private _entreprise: BehaviorSubject<Entreprise | null> = new BehaviorSubject(null);
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


    getEntreprises():Observable<any>{
        return this._httpClient.get<any>(`${environment.apiUrl}/entreprises/all`).pipe(
            shareReplay(1),
            tap((response) => {
                console.log(response);               
                this._entreprises.next(response);
                
            })
        );

    }


}
