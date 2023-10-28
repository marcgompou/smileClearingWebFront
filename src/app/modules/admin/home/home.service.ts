import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import * as moment from 'moment';
import { environment } from 'environments/environment';




@Injectable({
    providedIn: 'root'
})
export class HomeService
{
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    private _entreprise: BehaviorSubject<any> = new BehaviorSubject(null);

  
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

    get entreprise$(): Observable<any>
    {
        return this._entreprise.asObservable();
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


    getDataDashboard(dateDebut:string,dateFin:string,idEntreprise:any=null): Observable<any>
    {   
        let params:HttpParams = new HttpParams();
        params = params.set('dateDebut', dateDebut);
        params = params.set('dateFin', dateFin);
        if(idEntreprise){
            params = params.set('idEntreprise', idEntreprise);
        }
        return this._httpClient.get<any>(`${environment.apiUrl}/remise/cheques/statistiques`,
        {
            params:params   
        }).pipe(
            tap((response) => {
                console.log("=Service data getDataDashboard response========>", response)
                this._data.next(response);
            })
        );
    }


    getEntreprises(): Observable<any>
    {   
        
        return this._httpClient.get<any>(`${environment.apiUrl}/entreprises/all`).pipe(
            tap((response) => {
                console.log("get entreprises stat accessible ", response)
                this._entreprise.next(response);
            })
        );
    }


  
};