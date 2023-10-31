import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, catchError, of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationUtilisateurServiceService {

  constructor(private _httpClient: HttpClient) {
  }

  private _confirmation : BehaviorSubject<any | null> = new BehaviorSubject(null);

  get getConfirmation$(): Observable<any> {
    return this._confirmation.asObservable();
}

  getConfirmation(token: string,email:string): Observable<any> {
    // let params:HttpParams = new HttpParams();
    // params.set('token',token);
    // params.set('email',email);
    // console.log("=====params========>",params);
    return this._httpClient.get<any>(`${environment.apiUrl}/Authentication/ConfirmeEmail?token=${token}&email=${email}`,
    ).pipe(
      tap((response) => {
          this._confirmation.next(response);
      }),

  );
  }
}
