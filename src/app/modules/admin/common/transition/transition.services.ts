import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { environment } from 'environments/environment';
import { Transition } from './transition.model';

@Injectable({
    providedIn: 'root'
})
export class TransitionService {

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }

    executerTransition(idObject: string, transition:Transition,decision?:boolean, commentaires?:string): Observable<any> {
        let endpoint = transition.endpoint.split('::')
        return this._httpClient.put(
            `${environment.apiUrl}/${endpoint[0]}/${idObject}/${endpoint[1]}`,{decision: decision, commentaires: commentaires}
        ).pipe(
            catchError((error) => {
                throw error;
            }),
            switchMap((response: any) => {
                return of(response);
            })
        );
    }
}