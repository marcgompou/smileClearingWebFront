import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PrelevementRetourService {
  constructor(private _httpClient: HttpClient) {}

  chargerRetourPrelevement(data: any): Observable<any> {
    return this._httpClient.put<any>(
      `${environment.apiUrl}/prelevement/admin/chargementRetour/${data?.prelevementEntete?.nomFichier}`,
      data
    );
  }
}
