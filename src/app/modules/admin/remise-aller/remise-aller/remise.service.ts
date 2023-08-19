import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, filter, catchError, Observable, of, switchMap, tap, map, take, throwError } from 'rxjs';
import { environment } from 'environments/environment';
import { Cheque, CompteEntreprises } from '../cheque.type';

@Injectable({
  providedIn: 'root'
})
export class CreerRemiseService {
  private _remise: BehaviorSubject<Cheque | null> = new BehaviorSubject(null);
  private _remises: BehaviorSubject<Cheque[] | null> = new BehaviorSubject(null);
  private _titulaire: BehaviorSubject<any> = new BehaviorSubject(null);
  private _compteEntreprises: BehaviorSubject<CompteEntreprises[] | null> = new BehaviorSubject(null);


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

  get compteEntreprises$(): Observable<any[]> {
    return this._compteEntreprises.asObservable();
  }
  // Setter to update the array
  public setRemise$(newArray: Cheque[]): void {
    this._remises.next(newArray);
  }



  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for utilisateurs
   */
  getChequeById(numChq: string): Observable<Cheque> {
    console.log('-------------------numchq--------------------', numChq);
    return this._remises.pipe(
      take(1),
      map((remise) => {
        // Trouver le chèque par son numéro
        console.log('----------------------------remise-----------', remise);
        const cheque = remise.find(item => item.numChq === numChq) || null;

        // Mettre à jour la remise si nécessaire (optionnel)
        this._remise.next(cheque);

        if (!cheque) {
          throw new Error('Impossible de trouver le chèque avec le numéro ' + numChq + ' !');
        }
        console.log('---------------------------------------', cheque);
        return cheque;
      })
    );
  }


  getCompteByEntreprise(): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiUrl}/compteClient/entreprise`).pipe(
      tap((response) => {
        console.log('test======================================');
        console.log(response);
        this._compteEntreprises.next(response);
      })
    );
  }



  //Table data service

  updateDataTable(value: any) {

    this._remises.next(value);
  }


  delete(id: string, endpoint: any): Observable<any> {
    return this._httpClient.delete<any>(`${environment.apiUrl}/${endpoint}/${id}`).pipe(
      catchError((error) => {
        throw error;
      }),
      switchMap((response: any) => {
        return of(response);
      })
    );
  }



  create(payload: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._httpClient.post(
      `${environment.apiUrl}/remise`,
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


  getTire(chequeData: any): Observable<any> {
    const {
      codeBanque, codeAgence, compte
    } = chequeData

    console.log("codeBanque-------", codeBanque);
    console.log("CodeAgence-------", codeAgence);
    console.log("compte-------", compte);

    let params = new HttpParams()
      .set('codeBanque', codeBanque ?? "_")
      .set('agence', codeAgence ?? "_")
      .set('numCompte', compte ?? "_");

    return this._httpClient.get<any>(`${environment.apiUrl}/titulaires?`, { params });

  }


  // fetchDataWithParameters(param1: string, param2: number): Observable<any> {
  //   // Set up the parameters
  //   let params = new HttpParams()
  //     .set('param1', param1)
  //     .set('param2', param2.toString());

  //   // Send the GET request with parameters
  //   return this.http.get(`${this.apiUrl}/data`, { params });
  // }



  // update( index: string, cheque: Cheque, remises: Cheque[]): Observable<any> {





  //     remises[index] = cheque;
  //     this.setRemise$(remises);
  //     console.log(`Check with numchqgoooooooooooooo----- ${remises} gooooood.`);



  //   return this._remises.pipe();

  // }


  /**
   * Getter for client
   */

}




