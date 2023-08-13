import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { environment } from 'environments/environment';
import { Historique } from './historique.types';

@Injectable({
    providedIn: 'root'
})
export class HistoriqueService {

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }
    getHistoriques(endpoint: string): Observable<Historique[]> {
        let endpoints = endpoint.split('::')
        return this._httpClient.get<any>(`${environment.apiUrl}/${endpoints[0]}/${endpoints[1]}`).pipe(
            catchError((error) => {
                throw error;
            }),
            switchMap((response: any) => {
                return of(response);
            })
        );
    }
}