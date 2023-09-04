import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable } from 'rxjs';
import { ImprimerRemiseService } from './imprimer-remise.service';

//Pas necessaire pour l'instant
 @Injectable({
     providedIn: 'root'
 })
// export class LoadDataRemiseEntrepriseResolver implements Resolve<boolean> {
//     /**
//      * Constructor
//      */
//     constructor( private _validerRemiseEntrepriseService: ValiderRemiseService) {}

//     resolve(route: ActivatedRouteSnapshot): Observable<any> {
//         return this._validerRemiseEntrepriseService.getRemiseAvalider();
//     }
//}

export class LoadDataEntrepriseResolver implements Resolve<boolean> {
    /**
     * Constructor
     */
    constructor( private _entreprises: ImprimerRemiseService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        return this._entreprises.getEntreprise();
    }

   
}

export class LoadDataImprimerResolver implements Resolve<boolean> {
    constructor( private _imprimerRemiseService: ImprimerRemiseService) {}
    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        return this._imprimerRemiseService.getRemiseImprimer();
    }

}