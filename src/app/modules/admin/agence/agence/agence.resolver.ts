import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { Observable } from "rxjs";
import { ResponseContrat } from "../../common/contrat/response.type";
import { AgenceService } from "./agence.service";

@Injectable({
    providedIn: 'root'
  })
  export class AgencesResolver implements Resolve<any>
  {
    /**
     * Constructor
     */
    constructor(private _agenceService: AgenceService) {
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
      return this._agenceService.getAgences();
    }
  }