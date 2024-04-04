import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable } from 'rxjs';
import { TraitementSalaireService } from './traitement-salaire.service';


@Injectable({
    providedIn: 'root'
  })
  export class LoadSalaireByIdResolver implements Resolve<boolean> {
    /**
       * Constructor
       */
    constructor(
        private _salaireService: TraitementSalaireService,
      private _router: Router)
    {
    }
  
  
  
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
          return this._salaireService.getSalaireById(route.paramMap.get('id')).pipe(
              // Error here means the requested product is not available
              catchError((error) => {
                  console.error("--------------------------error resolver LoadPrelevRemiseByIdResolver-----------",error);  
                  // Navigate to there
                  this._router.navigateByUrl("home");
                  // Throw an error
                  throw error;
              })
          );
    }
  }



 
@Injectable({
  providedIn: 'root'
})
export class LoadSuiviSalaireResolver implements Resolve<boolean> {
  /**
     * Constructor
     */
  constructor(
      private _suiviSalaireService: TraitementSalaireService,
    private _router: Router)
  {
  }



  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
  {
        return this._suiviSalaireService.getHistoriqueSalaire(route.paramMap.get('id')).pipe(
            // Error here means the requested product is not available
            catchError((error) => {
                console.error("--------------------------error resolver LoadPrelevRemiseByIdResolver-----------",error);  
                // Navigate to there
                this._router.navigateByUrl("home");
                // Throw an error
                throw error;
            })
        );
  }
}



  