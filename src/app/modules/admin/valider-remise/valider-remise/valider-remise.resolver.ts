import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable } from 'rxjs';
import { ValiderRemiseService } from './valider-remise.service';

//Pas necessaire pour l'instant
// @Injectable({
//     providedIn: 'root'
// })
// export class LoadDataRemiseEntrepriseResolver implements Resolve<boolean> {
//     /**
//      * Constructor
//      */
//     constructor( private _validerRemiseEntrepriseService: ValiderRemiseService) {}

//     resolve(route: ActivatedRouteSnapshot): Observable<any> {
//         return this._validerRemiseEntrepriseService.getRemiseAvalider();
//     }
//}