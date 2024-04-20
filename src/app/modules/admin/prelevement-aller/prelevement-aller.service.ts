import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PrelevementAllerService {
  constructor(private _httpClient: HttpClient) {}

  createPrelevement(data: any): Observable<any> {
    return this._httpClient.post<any>(
      `${environment.apiUrl}/prelevement/`,
      data
    );
  }
}
