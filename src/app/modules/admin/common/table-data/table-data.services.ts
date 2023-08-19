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
    public _endpoint: String; //endpoint
    public _paginationObject: any;
    public _id:string|null="";  //Pour la recuperation du path parameter
    public _hasPagination:Boolean=true; //permet de savoir si on doit tenir compte de la pagination
    public _filterObject: any;

    /**
     * Constructor
     */

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for datas
     */
    get datas$(): Observable<any[]> {
        return this.datas.asObservable();
    }
    set datas$(data){
        this.data.next(data);
    }


    /**
     * Getter for data
     */
    get data$(): Observable<any> {
        return this.data.asObservable();
    }

    public setData$(data): void{
        this.data.next(data);
    }


    getDatas(): Observable<any> {
        //Verifier que filter object exist
        let filterString = "";
        let paginationString="";
        //PATH PARAMETER IS SET 
        if(this._id){
            filterString=this._id;
        }

        if(this._id===this._endpoint){
            filterString="";
        }
        //Si On tient compte de la pagination
        if(this._hasPagination){
            
            if(!this._paginationObject){
                this._paginationObject = {
                    page: 0,
                    size: 3000
                };
            }
            // Definir une valeur par defaut
            this._paginationObject.page = this._paginationObject.page || 0;
            this._paginationObject.size = this._paginationObject.size || 10;
            
            paginationString = Object.entries(this._paginationObject)
                .filter(([key, value]) => value) // Exclude falsy values
                .map(([key, value]) => `${key}=${value}`)
                .join('&');
            // Creation de la chaine de recherche
            if (this._filterObject) {
                paginationString = Object.entries(this._filterObject)
                    .filter(([key, value]) => value) // Exclude falsy values
                    .map(([key, value]) => `${key}=${value}`)
                    .join('&') + "&" + paginationString;
            }
            console.log("filtering-----------------", paginationString);
            filterString=filterString+"?"+paginationString;

        }
        return this._httpClient.get<any>(`${environment.apiUrl}/${this._endpoint}/${filterString}`).pipe(
            tap((response) => {
                //response.sort((a, b) => (a.creationDate < b.creationDate) ? 1 : -1);
                console.log("=Service response========>", response)
                this.datas.next(response);
            })
        );

    }

    getDatasByPath(): Observable<any> {


        return this._httpClient.get<any>(`${environment.apiUrl}/${this._endpoint}`).pipe(
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