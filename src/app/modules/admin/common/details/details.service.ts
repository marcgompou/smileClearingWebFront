import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, catchError, of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetailsService {
  
  /**
   * Constructor
   */
  constructor(private _httpClient:HttpClient) { }
  
  private data: BehaviorSubject<any> = new BehaviorSubject(null);




  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for utilisateurs
   */


  /**
   * Getter for utilisateur
   */
  get data$(): Observable<any> {
      return this.data.asObservable();
  }






  getById(id:any,endpoint:string): Observable<any> {
    console.log(id);
    return this._httpClient.get<any>(`${environment.apiUrl}/${endpoint}/${id}`).pipe(
      tap((response) => {
        console.log(response)
        this.data.next(response);
      })
    );
  }


  refreshTable(endpoint:string): Observable<any> {
    
    return this._httpClient.get<any>(`${environment.apiUrl}/${endpoint}`).pipe(
      tap((response) => {
        console.log(response)
        this.data.next(response);
      })
    );
  }

  delete(id: string,endpoint:any): Observable<any>
  {
      return this._httpClient.delete<any>(`${environment.apiUrl}/${endpoint}/${id}`).pipe(
          catchError((error) =>{
              throw error;
          }),
          switchMap((response: any) => {
              return of(response);
          })
      );
  }

  update(id: string,endpoint:any, payload: any): Observable<any> {
    return this._httpClient.put(
        `${environment.apiUrl}/${endpoint}/${id}`,
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
