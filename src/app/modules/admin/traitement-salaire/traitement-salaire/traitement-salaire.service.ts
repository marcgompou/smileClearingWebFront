import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, filter, catchError, Observable, of, switchMap, tap, map, take, throwError } from 'rxjs';
import { environment } from 'environments/environment';
import { Salaire } from '../salaire.type';

@Injectable({
  providedIn: 'root'
})
export class TraitementSalaireService {
  private _salaires: BehaviorSubject<Salaire[] | null> = new BehaviorSubject(null);
  private _titulaire: BehaviorSubject<any> = new BehaviorSubject(null);
  private _salaireAvalides: BehaviorSubject< Salaire []| null> = new BehaviorSubject(null);
  private _salaire: BehaviorSubject<Salaire | null> = new BehaviorSubject(null);
  

  /**
   * Constructor
   */
  constructor(private _httpClient: HttpClient) {
  }

 
  // Getter for the observable
  get salaire$(): Observable<any> {
    return this._salaire.asObservable();
  }

  get salaires$(): Observable<any[]> {
    return this._salaires.asObservable();
  }

  get titulaire$(): Observable<any[]> {
    return this._titulaire.asObservable();
  }

  get SalaireAvalides$(): Observable<any[]> {
    return this._salaireAvalides.asObservable();
  }
  // Setter to update the array
  public setSalaires$(newArray: Salaire[]): void {
    this._salaires.next(newArray);
  }

 
  public setSalaire$(newArray: Salaire): void {
    this._salaire.next(newArray);
  }

  getSalaireAtraitement(): Observable<any>
  {
      return this._httpClient.get<any>(`${environment.apiUrl}/salaire/salaire?statut=3`).pipe(
          tap((response) => {
            console.log('test======================================');
            console.log(response);
              this._salaireAvalides.next(response);
          })
      );
  }
   //Table data service

  updateDataTable(value: any) {

    this._salaires.next(value);
  }

  cloturerSalaire(idsalaire:string){

    return this._httpClient.put<any>(`${environment.apiUrl}/salaire/admin/cloture/${idsalaire}`,null).pipe(
      tap((response) => {
        console.log(response);
      })
    );


  }

  telechargerSalaireValider(id:string): Observable<Blob> {
    // Make a GET request to the file URL, specifying responseType as 'blob'
    return this._httpClient.get(`${environment.apiUrl}/salaire/admin/telechargement/${id}`, { responseType: 'blob' });
  }
  telechargerRelance(id: string): Observable<void> {
    return this._httpClient.get(`${environment.apiUrl}/salaire/admin/telechargementReprise/${id}`, { responseType: 'arraybuffer', observe: 'response' })
      .pipe(
        map((response: HttpResponse<ArrayBuffer>) => {
          console.log("===relance response===>",response)
          const contentDispositionHeader = response.headers.get('Content-Disposition');
          console.log('===Content-Disposition===>',contentDispositionHeader)
          const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          const matches = contentDispositionHeader.match(filenameRegex);
          
          // Check if there is a match and get the filename
          const filename = matches && matches[1];
          
          console.log('Filename:', filename);
          const blob = new Blob([response.body], { type: 'application/octet-stream' });

          // Trigger the download
          this.downloadFileBlob(blob, filename || 'file.txt');
        })
      );
  }

  private downloadFileBlob(blob: Blob, filename: string): void {
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  getSalaireATraiter(id): Observable<any>
  {
      return this._httpClient.get<any>(`${environment.apiUrl}/salaire/admin/atraiter/${id}`).pipe(
          tap((response) => {
            console.log('test======================================');
            console.log(response);
              this._salaire.next(response);
          })
      );
  }





}




