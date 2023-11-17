import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, filter, catchError, Observable, of, switchMap, tap, map, take, throwError } from 'rxjs';
import { environment } from 'environments/environment';
import { Prelevement } from '../prelevement.type';

@Injectable({
  providedIn: 'root'
})
export class TraitementPrelevementService {
  private _prelevements: BehaviorSubject<Prelevement[] | null> = new BehaviorSubject(null);
  private _titulaire: BehaviorSubject<any> = new BehaviorSubject(null);
  private _prelevementAvalides: BehaviorSubject< Prelevement []| null> = new BehaviorSubject(null);
  private _prelevement: BehaviorSubject<Prelevement | null> = new BehaviorSubject(null);
  

  /**
   * Constructor
   */
  constructor(private _httpClient: HttpClient) {
  }

 
  // Getter for the observable
  get prelevement$(): Observable<any> {
    return this._prelevement.asObservable();
  }

  get prelevements$(): Observable<any[]> {
    return this._prelevements.asObservable();
  }

  get titulaire$(): Observable<any[]> {
    return this._titulaire.asObservable();
  }

  get PrelevementAvalides$(): Observable<any[]> {
    return this._prelevementAvalides.asObservable();
  }
  // Setter to update the array
  public setPrelevements$(newArray: Prelevement[]): void {
    this._prelevements.next(newArray);
  }

 
  public setPrelevement$(newArray: Prelevement): void {
    this._prelevement.next(newArray);
  }

  getPrelevementAtraitement(): Observable<any>
  {
      return this._httpClient.get<any>(`${environment.apiUrl}/prelevement/prelevement?statut=3`).pipe(
          tap((response) => {
            console.log('test======================================');
            console.log(response);
              this._prelevementAvalides.next(response);
          })
      );
  }
   //Table data service

  updateDataTable(value: any) {

    this._prelevements.next(value);
  }

  cloturerPrelevement(idprelevement:string){

    return this._httpClient.put<any>(`${environment.apiUrl}/prelevement/admin/cloture/${idprelevement}`,null).pipe(
      tap((response) => {
        console.log(response);
      })
    );


  }

  telechargerPrelevementValider(id:string): Observable<Blob> {
    // Make a GET request to the file URL, specifying responseType as 'blob'
    return this._httpClient.get(`${environment.apiUrl}/prelevement/admin/telechargement/${id}`, { responseType: 'blob' });
  }
  telechargerRelance(id:string): Observable<Blob> {
    // Make a GET request to the file URL, specifying responseType as 'blob'
    return this._httpClient.get(`${environment.apiUrl}/prelevement/admin/telechargementReprise/${id}`, { responseType: 'blob' });
  }


  getPrelevementATraiter(id): Observable<any>
  {
      return this._httpClient.get<any>(`${environment.apiUrl}/prelevement/admin/atraiter/${id}`).pipe(
          tap((response) => {
            console.log('test======================================');
            console.log(response);
              this._prelevement.next(response);
          })
      );
  }





}




