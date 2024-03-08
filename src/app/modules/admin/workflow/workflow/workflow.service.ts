import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError,Observable, of, switchMap, tap} from 'rxjs';
import { CompteAfb } from './compteAfb.types';
import { environment } from 'environments/environment';
import { Agence } from 'app/modules/admin/agence/agence/agence.types';

@Injectable({
    providedIn: 'root'
})
@Injectable()
export class CompteService
{   
    private _compte: BehaviorSubject<CompteAfb[] | null> = new BehaviorSubject(null);
    private _client: BehaviorSubject<CompteAfb | null> = new BehaviorSubject(null);
    
    private _agence: BehaviorSubject<Agence[] | null> = new BehaviorSubject(null);
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
     get compte$(): Observable<any> {
        return this._compte.asObservable();
    }

    /**
     * Getter for client
     */
    get client$(): Observable<CompteAfb> {
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
    createCompte( compte: CompteAfb): Observable<any> {
        console.log('*------------------idEntreprise',compte.identreprise);
        return this._httpClient.post(
            `${environment.apiUrl}/compteAfb120`,
            compte
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
     * @param compte 
     * @returns 
     */
    update(id: string, compte: CompteAfb): Observable<any> {
        return this._httpClient.put(
            `${environment.apiUrl}/compteAfb120/${id}`,
            compte
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

        return this._httpClient.get<any>(`${environment.apiUrl}/compteAfb120`).pipe(
            tap((response) => {
                console.log('test======================================');
                console.log(response);
              //  response.sort((a,b)=>(a.creationDate<b.creationDate)? 1:-1);
               
                this._compte.next(response);
                
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
        return this._httpClient.get<any>(`${environment.apiUrl}/compteAfb120/${id}`).pipe(
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
        return this._httpClient.delete<any>(`${environment.apiUrl}/compteAfb120/${id}`).pipe(
            catchError((error) =>{
                throw error;
            }),
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

}
