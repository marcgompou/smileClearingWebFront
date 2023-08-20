import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, filter, catchError, Observable, of, switchMap, tap, map, take, throwError } from 'rxjs';
import { environment } from 'environments/environment';
import { Remise } from '../remise.type';

@Injectable({
  providedIn: 'root'
})
export class ImporterRemiseService {
  // private _remise: BehaviorSubject<Remise | null> = new BehaviorSubject(null);
  private _remises: BehaviorSubject<Remise[] | null> = new BehaviorSubject(null);
  private _titulaire: BehaviorSubject<any> = new BehaviorSubject(null);
  private _remiseAvalides: BehaviorSubject< Remise []| null> = new BehaviorSubject(null);
  

  /**
   * Constructor
   */
  constructor(private _httpClient: HttpClient) {
  }

 
  // Getter for the observable
  get remise$(): Observable<any[]> {
    return this._remises.asObservable();
  }

  get titulaire$(): Observable<any[]> {
    return this._titulaire.asObservable();
  }

  get remiseAvalides$(): Observable<any[]> {
    return this._remiseAvalides.asObservable();
  }
  // Setter to update the array
  public setRemise$(newArray: Remise[]): void {
    this._remises.next(newArray);
  }

  

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------


  getExportation(): Observable<any>
  {
      return this._httpClient.get<any>(`${environment.apiUrl}/exportation`).pipe(
          tap((response) => {
            console.log('test======================================');
            console.log(response);
              this._remiseAvalides.next(response);
          })
      );
  }



   //Table data service

  updateDataTable(value: any) {

    this._remises.next(value);
  }

  validerRemise(idRemise:string){

    return this._httpClient.put<any>(`${environment.apiUrl}/remise/validation/${idRemise}`,null).pipe(
      tap((response) => {
        console.log('test======================================');
        console.log(response);
        //this._remiseAvalides.next(response);
      })
    );


  }
  exporterRemise(){

    return this._httpClient.put<any>(`${environment.apiUrl}/remise/exportation`,null).pipe(
      tap((response) => {
        console.log('test======================================');
        console.log(response);
        //this._remiseAvalides.next(response);
      })
    );


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




