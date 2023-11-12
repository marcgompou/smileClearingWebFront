import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, filter, catchError, Observable, of, switchMap, tap, map, take, throwError } from 'rxjs';
import { environment } from 'environments/environment';
import { Prelevement } from '../prelevement.type';

@Injectable({
  providedIn: 'root'
})
export class ValiderPrelevementService {
  // private _remise: BehaviorSubject<Remise | null> = new BehaviorSubject(null);
  private _prelevements: BehaviorSubject<Prelevement[] | null> = new BehaviorSubject(null);
  private _prelevementRemise: BehaviorSubject<any | null> = new BehaviorSubject(null);

  private _titulaire: BehaviorSubject<any> = new BehaviorSubject(null);
  private _prelevementAvalides: BehaviorSubject< Prelevement []| null> = new BehaviorSubject(null);
  

  /**
   * Constructor
   */
  constructor(private _httpClient: HttpClient) {
  }

 
  // Getter for the observable
  get prelevement$(): Observable<any[]> {
    return this._prelevements.asObservable();
  }
  get prelevementRemise$(): Observable<any> {
    return this._prelevementRemise.asObservable();
  }

  get titulaire$(): Observable<any[]> {
    return this._titulaire.asObservable();
  }

  get PrelevementAvalides$(): Observable<any[]> {
    return this._prelevementAvalides.asObservable();
  }
  // Setter to update the array
  public setPrelevement$(newArray: Prelevement[]): void {
    this._prelevements.next(newArray);
  }

  public setPrelevementRemise$(newArray: Prelevement[]): void {
    this._prelevementRemise.next(newArray);
  }


  getPrelevementAvalider(): Observable<any>
  {
      return this._httpClient.get<any>(`${environment.apiUrl}/prelevement/prelevement?statut=1`).pipe(
          tap((response) => {
            console.log('test======================================');
            console.log(response);
              this._prelevementAvalides.next(response);
          })
      );
  }


  getPrelevementRemiseById(id): Observable<any>
  {
      return this._httpClient.get<any>(`${environment.apiUrl}/prelevement/${id}`).pipe(
          tap((response) => {
            console.log('test======================================');
            console.log(response);
              this._prelevementRemise.next(response);
          })
      );
  }


   //Table data service

  updateDataTable(value: any) {

    this._prelevements.next(value);
  }

  validerPrelevement(idprelevement:string){

    return this._httpClient.put<any>(`${environment.apiUrl}/prelevement/validation/${idprelevement}`,null).pipe(
      tap((response) => {
        console.log('testidprelevement======================================');
        console.log(response);
        //this._remiseAvalides.next(response);
      })
    );


  }

  telechargerRetourPrelevement(id:string): Observable<Blob> {
    // Make a GET request to the file URL, specifying responseType as 'blob'
    return this._httpClient.get(`${environment.apiUrl}/prelevement/telechargementRetour/${id}`, { responseType: 'blob' });
}

  //TODO AJOUTER UN MODAL DE CONFIRMATION
  supprimerRemise(idRemise:string){

    return this._httpClient.delete<any>(`${environment.apiUrl}/remise/${idRemise}`).pipe(
      tap((response) => {
        console.log('test======================================');
        console.log(response);
        //this._remiseAvalides.next(response);
      })
    );


  }




}




