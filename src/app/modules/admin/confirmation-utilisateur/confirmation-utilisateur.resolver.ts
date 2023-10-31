import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { ConfirmationUtilisateurServiceService } from "./confirmation-utilisateur.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
  export class ConfirmationUtilisateurResolver implements Resolve<any>
  {
    /**
     * Constructor
     */
    constructor(private _confirmationUtilisateurService: ConfirmationUtilisateurServiceService,) {
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {

     let token:string=route.queryParams['token'];
     const email:string=route.queryParams['email'];
     token=encodeURIComponent(token)
     console.log("=====token========>",token)
      return this._confirmationUtilisateurService.getConfirmation(token,email);
    }
  
  }