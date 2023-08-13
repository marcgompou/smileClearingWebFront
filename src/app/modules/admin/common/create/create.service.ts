import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, catchError, switchMap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreateService {

  constructor(private _httpClient: HttpClient) {}


     /**
     * Create utilisateur
     * @param utilisateur 
     * @returns 
     */

    create(endpoint: string,payload:any): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
       return this._httpClient.post(
          `${environment.apiUrl}/${endpoint}`,
          payload, { headers }
      ).pipe(
          catchError((error) => {
              throw error;
          }),
          switchMap((response: any) => {
              return of(response);
          })
      );
    }


    update(endpoint: string,payload:any): Observable<any> {
      return this._httpClient.put(
          `${environment.apiUrl}/${endpoint}`,
          payload
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
