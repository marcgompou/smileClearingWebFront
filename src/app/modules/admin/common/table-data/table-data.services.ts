import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TableDataService {

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) { }


    private datas: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private data: BehaviorSubject<any | null> = new BehaviorSubject(null);
    public _endpoint: String;
    public _paginationObject: any;

    public _filterObject: any;

    /**
     * Constructor
     */

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for utilisateurs
     */
    get datas$(): Observable<any[]> {
        return this.datas.asObservable();
    }

    /**
     * Getter for utilisateur
     */
    get data$(): Observable<any> {
        return this.data.asObservable();
    }



   

    getDatas(): Observable<any> {
        //Verifier que filter object exist
        if (!this._paginationObject) {
            this._paginationObject = {
                page: 0,
                size: 3000
            };
        }

        // Definir une valeur par defaut
        this._paginationObject.page = this._paginationObject.page || 0;
        this._paginationObject.size = this._paginationObject.size || 10;



        let filterString = "";

        filterString = Object.entries(this._paginationObject)
            .filter(([key, value]) => value) // Exclude falsy values
            .map(([key, value]) => `${key}=${value}`)
            .join('&');

        // Creation de la chaine de recherche
        if (this._filterObject) {

            filterString = Object.entries(this._filterObject)
                .filter(([key, value]) => value) // Exclude falsy values
                .map(([key, value]) => `${key}=${value}`)
                .join('&') + "&" + filterString;

        }

        console.log("filtering-----------------", filterString);
     

        return this._httpClient.get<any>(`${environment.apiUrl}/${this._endpoint}/?${filterString}`).pipe(
            tap((response) => {
                //response.sort((a, b) => (a.creationDate < b.creationDate) ? 1 : -1);
                console.log("=Service response========>", response)
                this.datas.next(response);
            })
        );
       
    }


    // getDatas(filerObject:any,paginationObject:any): Observable<any[]> {


    //     //Verifier que filter object exist
    //     if (!paginationObject) {
    //         paginationObject = {
    //             page: 0,
    //             size: 10
    //         };
    //     }

    //     // Definir une valeur par defaut
    //     paginationObject.page = paginationObject.page || 0;
    //     paginationObject.size = paginationObject.size || 10;



    //     let filterString ="";

    //     filterString=Object.entries(paginationObject)
    //         .filter(([key, value]) => value) // Exclude falsy values
    //         .map(([key, value]) => `${key}=${value}`)
    //         .join('&');

    //     // Creation de la chaine de recherche
    //     if(filerObject){

    //         filterString= Object.entries(filerObject)
    //         .filter(([key, value]) => value) // Exclude falsy values
    //         .map(([key, value]) => `${key}=${value}`)
    //         .join('&')+"&"+filterString;

    //     } 

    //     return this._httpClient.get<any>(`${environment.apiUrl}/${this._endpoint}?${filterString}`).pipe(
    //         catchError((error) => {
    //             throw error;
    //         }),
    //         switchMap((response: any) => {
    //             return of(response);
    //         })
    //     );
    // }

}