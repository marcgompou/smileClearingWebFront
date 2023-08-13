import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AgenceService } from './agence.service';
import { Agence } from './agence.types';
import { ResponseContrat } from 'app/modules/admin/common/contrat/response.type';




@Injectable({
  providedIn: 'root'
})
export class AgenceResolver implements Resolve<any>
{
  /**
   * Constructor
   */
  constructor(private _agenceService: AgenceService)
  {
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
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ResponseContrat>
  {
      return this._agenceService.get();
  }
}

