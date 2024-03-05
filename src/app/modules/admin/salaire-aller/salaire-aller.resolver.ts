import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { SalaireAllerService } from './salaire-aller.service';

@Injectable({
  providedIn: 'root'
})
export class SalaireAllerResolver implements Resolve<boolean> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return of(true);
  }
}
@Injectable({
  providedIn: 'root'
})
export class LoadDataCompteEntrepriseResolver implements Resolve<boolean> {
  /**
   * Constructor
   */
  constructor( private _compteEntreprises: SalaireAllerService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
      return this._compteEntreprises.getCompteByEntreprise();
  }

}