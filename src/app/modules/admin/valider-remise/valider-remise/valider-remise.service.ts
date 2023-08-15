import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, filter, catchError, Observable, of, switchMap, tap, map, take, throwError } from 'rxjs';
import { environment } from 'environments/environment';
import { Remise } from '../remise.type';

@Injectable({
  providedIn: 'root'
})
export class ValiderRemiseService {
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

  /**
   * Getter for utilisateurs
   */
  // getRemiseById(numChq: string): Observable<Remise> {
  //   console.log('-------------------numchq--------------------', numChq);
  //   return this._remises.pipe(
  //     take(1),
  //     map((remise) => {
  //       // Trouver le chèque par son numéro
  //       console.log('----------------------------remise-----------', remise);
  //       const cheque = remise.find(item => item.numChq === numChq) || null;

  //       // Mettre à jour la remise si nécessaire (optionnel)
  //       this._remise.next(cheque);

  //       if (!cheque) {
  //         throw new Error('Impossible de trouver le chèque avec le numéro ' + numChq + ' !');
  //       }
  //       console.log('---------------------------------------', cheque);
  //       return cheque;
  //     })
  //   );
  // }


  getRemiseAvalider(): Observable<any>
  {
      return this._httpClient.get<any>(`${environment.apiUrl}/remise/entreprise?statut=1`).pipe(
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






}




