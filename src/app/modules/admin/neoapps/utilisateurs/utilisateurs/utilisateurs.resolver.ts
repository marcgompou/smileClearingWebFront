import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { UtilisateursService } from './utilisateurs.service';
// import { Utilisateurs } from './utilisateurs.types';
import { ResponseContrat } from 'app/modules/admin/common/contrat/response.type';




@Injectable({
  providedIn: 'root'
})
export class UtilisateursResolver implements Resolve<any>
{
  /**
   * Constructor
   */
  constructor(private _utilisateursService: UtilisateursService) {
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
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ResponseContrat> {
    return this._utilisateursService.getUtilisateurs();
  }
}



@Injectable({
  providedIn: 'root'
})
export class UtilisateursByIdResolver implements Resolve<any>
{
  /**
   * Constructor
   */
  constructor(private _utilisateursService: UtilisateursService) {
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
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ResponseContrat> {
    let id: string = route.params['id'];
    return this._utilisateursService.getUtilisateurById(id);
  }
}



@Injectable({
  providedIn: 'root'
})
export class RolesResolver implements Resolve<any>
{
  /**
   * Constructor
   */
  constructor(private _utilisateursService: UtilisateursService) {
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
    return this._utilisateursService.getRoles();
  }



}


@Injectable({
  providedIn: 'root'
})
export class EntreprisesResolver implements Resolve<any>
{
  /**
   * Constructor
   */
  constructor(private _utilisateursService: UtilisateursService) {
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
    return this._utilisateursService.getEntreprises();
  }

}