import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalaireAllerService {

  
  constructor(private _httpClient: HttpClient) {
  }

  createSalaire(data: any):  Observable<any>{
    return this._httpClient.post<any>(`${environment.apiUrl}/salaire/`,data)
  }


}
