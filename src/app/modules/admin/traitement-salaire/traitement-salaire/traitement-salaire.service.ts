import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, filter, catchError, Observable, of, switchMap, tap, map, take, throwError } from 'rxjs';
import { environment } from 'environments/environment';
import { Salaire } from '../salaire.type';

@Injectable({
  providedIn: 'root'
})
export class TraitementSalaireService {
  // private _remise: BehaviorSubject<Remise | null> = new BehaviorSubject(null);
  private _salaires: BehaviorSubject<Salaire[] | null> = new BehaviorSubject(null);
  private _salaireRemise: BehaviorSubject<any | null> = new BehaviorSubject(null);

  private _titulaire: BehaviorSubject<any> = new BehaviorSubject(null);
  private _salaireAvalides: BehaviorSubject< Salaire []| null> = new BehaviorSubject(null);
  private _suiviSalaire: BehaviorSubject< any | null> = new BehaviorSubject(null);
private _salaireservice: BehaviorSubject< any | null> = new BehaviorSubject(null);
  /**
   * Constructor
   */
  constructor(private _httpClient: HttpClient) {
  }

 
  // Getter for the observable
  get salaire$(): Observable<any[]> {
    return this._salaires.asObservable();
  }
  get salaireRemise$(): Observable<any> {
    return this._salaireRemise.asObservable();
  }

  get titulaire$(): Observable<any[]> {
    return this._titulaire.asObservable();
  }

  get salaireAvalides$(): Observable<any[]> {
    return this._salaireAvalides.asObservable();
  }

  get suiviSalaire$(): Observable<any[]> {
    return this._suiviSalaire.asObservable();
  }

  // Setter to update the array
  public setSalaire$(newArray: Salaire[]): void {
    this._salaires.next(newArray);
  }

  public setSalaireRemise$(newArray: Salaire[]): void {
    this._salaireRemise.next(newArray);
  }



  getHistoriqueSalaire(idsalaire:string): Observable<any>
  {
      return this._httpClient.get<any>(`${environment.apiUrl}/SuiviSalaire/admin/${idsalaire}`).pipe(
          tap((response) => {
            console.log('test===============SuiviSalaire=======================',response);
            console.log(response);
              this._suiviSalaire.next(response);
          })
      );
  }

  getSalaireById(id): Observable<any>
  {
      return this._httpClient.get<any>(`${environment.apiUrl}/salaires/admin/${id}`).pipe(
          tap((response) => {
            console.log('test======================================');
            console.log(response);
              this._salaireRemise.next(response);
          })
      );
  }


   //Table data service

  updateDataTable(value: any) {

    this._salaires.next(value);
  }

  traitementSalaire(idsalaire:string){

    return this._httpClient.put<any>(`${environment.apiUrl}/salaires/validation/${idsalaire}`,null).pipe(
      tap((response) => {
        console.log('testidsalaire======================================');
        console.log(response);
        //this._remiseAvalides.next(response);
      })
    );


  }

  // telechargerSalaireValider(id:string): Observable<Blob> {
  //   // Make a GET request to the file URL, specifying responseType as 'blob'
  //   return this._httpClient.get(`${environment.apiUrl}/salaires/telechargementSalaire/${id}`, { responseType: 'blob' });
  // }

  telechargerSalaireValider(id: string): Observable<{ blob: Blob, fileName: string }> {
    return this._httpClient.get(`${environment.apiUrl}/salaires/telechargementSalaire/${id}`, { responseType: 'blob', observe: 'response' })
      .pipe(
        map((response: HttpResponse<Blob>) => {
          const blob = response.body;
          const fileName = this.getFileNameFromResponseHeader(response.headers);
          return { blob, fileName };
        })
      );
  }

   private getFileNameFromResponseHeader(headers: HttpHeaders): string {
    const contentDispositionHeader: string | null = headers.get('Content-Disposition');
    console.log("contentDispositionHeader=====>",contentDispositionHeader)
    if (contentDispositionHeader) {
      const match = contentDispositionHeader.match(/filename=(.+);/);
      console.log("match=====>",match)
      return match ? match[1] : 'salaire.rec'; // Si le nom de fichier n'est pas trouvé, utiliser un nom par défaut
    } else {
      console.error("Impossible de récupérer le nom de fichier à partir de l'en-tête de la réponse.");
      return 'salaire.rec'; // Fallback si l'en-tête n'est pas présent
    }
  }

  telechargerRetourSalaire(id:string): Observable<Blob> {
    // Make a GET request to the file URL, specifying responseType as 'blob'
    return this._httpClient.get(`${environment.apiUrl}/salaires/telechargementRetour/${id}`, { responseType: 'blob' });
  }



  telechargerRelance(id: string): Observable<void> {
    return this._httpClient.get(`${environment.apiUrl}/salaires/telechargementReprise/${id}`, { responseType: 'arraybuffer', observe: 'response' })
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




