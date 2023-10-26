import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import * as moment from 'moment';
import { environment } from 'environments/environment';




@Injectable({
    providedIn: 'root'
})
export class HomeService
{
private _data: BehaviorSubject<any> = new BehaviorSubject(null);
//private _getDataDashboard: BehaviorSubject<  []| null> = new BehaviorSubject(null);
  
constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for data
     */
    get data$(): Observable<any>
    {
        return this._data.asObservable();
    }

    
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get data
     */
    getData(): Observable<any>
    {   
        console.log("test 1");
        return this._httpClient.get('api/dashboards/project').pipe(
            tap((response: any) => {
                this._data.next(response);
            })
        );
    }


    getDataDashboard(): Observable<any>
    {   
        return this._httpClient.get<any>(`${environment.apiUrl}/remise/cheques/statistiques?DateDebut=2023-10-01&DateFin=2023-10-30&IdEntreprise=1000`).pipe(
            tap((response) => {
                //response.sort((a, b) => (a.creationDate < b.creationDate) ? 1 : -1);
                console.log("=Service data getDataDashboard response========>", response)
                this._data.next(response);
            })
        );
    }

//     getPrelevementAvalider(): Observable<any>
//   {
//       return this._httpClient.get<any>(`${environment.apiUrl}/prelevement/prelevement?statut=1`).pipe(
//           tap((response) => {
//             console.log('test======================================');
//             console.log(response);
//               this._prelevementAvalides.next(response);
//           })
//       );
//   }

  
};