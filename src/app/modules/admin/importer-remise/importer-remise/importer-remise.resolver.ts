import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, forkJoin, Observable } from 'rxjs';
import { ImporterRemiseService } from './importer-remise.service';

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
    constructor( private _entreprises: ImporterRemiseService) {}

  

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        return forkJoin({
          superExportateur: this._entreprises.getSuperExportateur(),
          entreprises: this._entreprises.getEntreprise()
        }).pipe(
          catchError((error) => {
            console.error('Erreur :', error);
            // Gérer l'erreur selon les besoins
            return [];
          })
        );
      }

}