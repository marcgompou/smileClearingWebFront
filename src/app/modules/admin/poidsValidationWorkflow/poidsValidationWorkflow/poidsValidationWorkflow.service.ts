import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError,Observable, of, switchMap, tap} from 'rxjs';
import { environment } from 'environments/environment';
import { PoidsValidationWorkflow } from './poidsValidationWorkflow.types';

@Injectable({
    providedIn: 'root'
})
@Injectable()
export class PoidsValidationWorkflowService
{   
    private _poidsValidationWorkflow: BehaviorSubject<PoidsValidationWorkflow[] | null> = new BehaviorSubject(null);
    private _client: BehaviorSubject<PoidsValidationWorkflow | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for compte
     */
     get poidsValidationWorkflow$(): Observable<any> {
        return this._poidsValidationWorkflow.asObservable();
    }

    /**
     * Getter for client
     */
    get client$(): Observable<PoidsValidationWorkflow> {
        return this._client.asObservable();
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods CRUD
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create client
     * @param compte 
    
     * @returns 
     */
    createPoidsValidationWorkflow( poidsValidationWorkflow: PoidsValidationWorkflow): Observable<any> {
        return this._httpClient.post(
            `${environment.apiUrl}/poidsValidationWorkflow`,
            poidsValidationWorkflow
        ).pipe(
            catchError((error) => {
                throw error;
            }),
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    /**
     * Update client
     * @param id 
     * @param poidsValidationWorkflow 
     * @returns 
     */
    update(id: string, poidsValidationWorkflow: PoidsValidationWorkflow): Observable<any> {
        return this._httpClient.put(
            `${environment.apiUrl}/poidsValidationWorkflow/${id}`,
            poidsValidationWorkflow
        ).pipe(
            catchError((error) => {
                throw error;
            }),
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    /**
     * Get compte
     */
    get():Observable<any>
    {

        return this._httpClient.get<any>(`${environment.apiUrl}/poidsValidationWorkflow`).pipe(
            tap((response) => {
                console.log('test======================================');
                console.log(response);
              //  response.sort((a,b)=>(a.creationDate<b.creationDate)? 1:-1);
               
                this._poidsValidationWorkflow.next(response);
                
            })
        );
        //console.log(HttpClient);
    }


    /**
     * Get client by id
     * @param id 
     * @returns 
     */
    getById(id: string): Observable<any>
    {
        return this._httpClient.get<any>(`${environment.apiUrl}/poidsValidationWorkflow/${id}`).pipe(
            tap((response) => {
                this._client.next(response);
            })
        );
    }

    /**
     * Delete client
     * @param id 
     * @returns 
     */
    delete(id: string): Observable<any>
    {
        return this._httpClient.delete<any>(`${environment.apiUrl}/poidsValidationWorkflow/${id}`).pipe(
            catchError((error) =>{
                throw error;
            }),
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

  

}
