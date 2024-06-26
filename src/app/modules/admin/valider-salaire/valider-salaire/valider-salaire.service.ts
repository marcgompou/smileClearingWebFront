import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, filter, catchError, Observable, of, switchMap, tap, map, take, throwError } from 'rxjs';
import { environment } from 'environments/environment';
import { Salaire } from '../salaire.type';

@Injectable({
  providedIn: 'root'
})
export class ValiderSalaireService {
  // private _remise: BehaviorSubject<Remise | null> = new BehaviorSubject(null);
  private _salaires: BehaviorSubject<Salaire[] | null> = new BehaviorSubject(null);
  private _salaireRemise: BehaviorSubject<any | null> = new BehaviorSubject(null);

  private _titulaire: BehaviorSubject<any> = new BehaviorSubject(null);
  private _salaireAvalides: BehaviorSubject< Salaire []| null> = new BehaviorSubject(null);
  private _suiviSalaire: BehaviorSubject< any | null> = new BehaviorSubject(null);

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


  // getSalaireAvalider(): Observable<any>
  // {
  //     return this._httpClient.get<any>(`${environment.apiUrl}/salaires?statut=1`).pipe(
  //         tap((response) => {
  //           console.log('test======================================');
  //           console.log(response);
  //             this._salaireAvalides.next(response);
  //         })
  //     );
  // }

  getHistoriqueSalaire(idsalaire:string): Observable<any>
  {
      return this._httpClient.get<any>(`${environment.apiUrl}/SuiviSalaire/${idsalaire}`).pipe(
          tap((response) => {
            console.log('test===============SuiviSalaire=======================',response);
            console.log(response);
              this._suiviSalaire.next(response);
          })
      );
  }

  getSalaireById(id): Observable<any>
  {
      return this._httpClient.get<any>(`${environment.apiUrl}/salaires/${id}`).pipe(
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

  validerSalaire(idsalaire:string){

    return this._httpClient.put<any>(`${environment.apiUrl}/salaires/validation/${idsalaire}`,null).pipe(
      tap((response) => {
        console.log('testidsalaire======================================');
        console.log(response);
        //this._remiseAvalides.next(response);
      })
    );


  }

  // rejeterSalaire(idsalaire:string,commentaire:string){

  //   return this._httpClient.put<any>(`${environment.apiUrl}/salaires/rejet/${idsalaire}`,null).pipe(
  //     tap((response) => {
  //       console.log('testidsalaire======================================');
  //       console.log(response);
  //       //this._remiseAvalides.next(response);
  //     })
  //   );
  // }


  rejeterSalaire(idsalaire: string, commentaire: string): Observable<any> {
    // Créez un objet contenant le commentaire à envoyer avec la requête
    const requestBody = { commentaire };
  
    return this._httpClient.put<any>(`${environment.apiUrl}/salaires/rejet/${idsalaire}`, requestBody).pipe(
      tap((response) => {
        console.log('Réponse de la requête de rejet du salaire :', response);
      }),
      catchError((error) => {
        console.error('Une erreur s\'est produite lors du rejet du salaire :', error);
        return throwError(error); // Renvoyez l'erreur pour que le composant puisse la gérer
      })
    );
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




}




