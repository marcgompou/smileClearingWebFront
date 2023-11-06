import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { Observable } from "rxjs";
import { ResponseContrat } from "../../common/contrat/response.type";
import { EntrepriseService } from "./entreprise.service";

@Injectable({
    providedIn: 'root'
  })
  export class EntreprisesResolver implements Resolve<any>
  {
    /**
     * Constructor
     */
    constructor(private _entrepriseService: EntrepriseService) {
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(): Observable<ResponseContrat> {
      return this._entrepriseService.getEntreprises();
    }
  
  }