import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { Observable } from "rxjs";
import { ImprimerRemiseService } from "./imprimer-remise.service";

//Pas necessaire pour l'instant
@Injectable({
  providedIn: "root",
})
export class LoadDataEntrepriseResolver implements Resolve<boolean> {
  /**
   * Constructor
   */
  constructor(private _entreprises: ImprimerRemiseService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this._entreprises.getEntreprise();
  }
}
