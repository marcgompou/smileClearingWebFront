import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, filter, catchError, Observable, of, switchMap, tap, map, take, throwError } from 'rxjs';
import { environment } from 'environments/environment';
import { Transaction } from '../transaction-bancaire.type';

@Injectable({
  providedIn: 'root'
})
export class ValiderTransactionService {
  // private _remise: BehaviorSubject<Remise | null> = new BehaviorSubject(null);
  private _transactions: BehaviorSubject<Transaction[] | null> = new BehaviorSubject(null);
  private _transactionRemise: BehaviorSubject<any | null> = new BehaviorSubject(null);

  private _data: BehaviorSubject<any> = new BehaviorSubject(null);
  private _entreprise: BehaviorSubject<any> = new BehaviorSubject(null);


  private _titulaire: BehaviorSubject<any> = new BehaviorSubject(null);
  private _transactionAvalides: BehaviorSubject< Transaction []| null> = new BehaviorSubject(null);
  

  /**
   * Constructor
   */
  constructor(private _httpClient: HttpClient) {
  }

 
  // Getter for the observable
  get transaction$(): Observable<any[]> {
    return this._transactions.asObservable();
  }
  get transactionRemise$(): Observable<any> {
    return this._transactionRemise.asObservable();
  }

  get titulaire$(): Observable<any[]> {
    return this._titulaire.asObservable();
  }

  get TransactionAvalides$(): Observable<any[]> {
    return this._transactionAvalides.asObservable();
  }
  // Setter to update the array
  public setTransaction$(newArray: Transaction[]): void {
    this._transactions.next(newArray);
  }

  public setTransactionRemise$(newArray: Transaction[]): void {
    this._transactionRemise.next(newArray);
  }


  getTransactionAvalider(): Observable<any>
  {
      return this._httpClient.get<any>(`${environment.apiUrl}/transaction/transaction?statut=1`).pipe(
          tap((response) => {
            console.log('test======================================');
            console.log(response);
              this._transactionAvalides.next(response);
          })
      );
  }


  getTransaction(dateDebut:string,dateFin:string,idEntreprise:any=null): Observable<any>
  {
    let params:HttpParams = new HttpParams();
    params = params.set('dateDebut', dateDebut);
    params = params.set('dateFin', dateFin);
    if(idEntreprise){
        params = params.set('idEntreprise', idEntreprise);
    }
    return this._httpClient.get<any>(`${environment.apiUrl}/`,
    {
        params:params   
    }).pipe(
        tap((response) => {
            console.log("=Service data getDataDashboard response========>", response)
            this._data.next(response);
        })
    );
  }


   //Table data service

  updateDataTable(value: any) {

    this._transactions.next(value);
  }

  validerTransaction(idtransaction:string){

    return this._httpClient.put<any>(`${environment.apiUrl}/transaction/validation/${idtransaction}`,null).pipe(
      tap((response) => {
        console.log('testidtransaction======================================');
        console.log(response);
        //this._remiseAvalides.next(response);
      })
    );


  }

  telechargerRetourTransaction(id:string): Observable<Blob> {
    // Make a GET request to the file URL, specifying responseType as 'blob'
    return this._httpClient.get(`${environment.apiUrl}/transaction/telechargementRetour/${id}`, { responseType: 'blob' });
  }



  telechargerRelance(id: string): Observable<void> {
    return this._httpClient.get(`${environment.apiUrl}/transaction/telechargementReprise/${id}`, { responseType: 'arraybuffer', observe: 'response' })
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




