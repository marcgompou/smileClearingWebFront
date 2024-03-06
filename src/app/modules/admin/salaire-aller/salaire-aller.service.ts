import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CompteEntreprises } from './salaire-aller.type';

@Injectable({
  providedIn: 'root'
})
export class SalaireAllerService {
  private _titulaire: BehaviorSubject<any> = new BehaviorSubject(null);
  private _compteEntreprises: BehaviorSubject<CompteEntreprises[] | null> = new BehaviorSubject(null);

  
  constructor(private _httpClient: HttpClient) {
  }

  get compteEntreprises$(): Observable<any[]> {
    return this._compteEntreprises.asObservable();
  }
  createSalaire(data: any):  Observable<any>{
    return this._httpClient.post<any>(`${environment.apiUrl}/salaire/`,data)
  }
  getCompteByEntreprise(): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiUrl}/compteClient/entreprise`).pipe(
      tap((response) => {
        console.log('test======================================');
        console.log(response);
        this._compteEntreprises.next(response);
      })
    );
  }


}
