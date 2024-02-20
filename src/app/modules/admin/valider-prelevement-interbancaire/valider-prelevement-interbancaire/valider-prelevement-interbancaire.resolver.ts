import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable } from 'rxjs';
import { ValiderPrelevementInterbancaireService } from './valider-prelevement-interbancaire.service';
//import { ValiderRemiseService } from './valider-remise.service';



@Injectable({
    providedIn: 'root'
  })
  export class LoadPrelevRemiseByIdResolver implements Resolve<boolean> {
    /**
       * Constructor
       */
    constructor(
        private _prelevementInterbancaireService: ValiderPrelevementInterbancaireService,
      private _router: Router)
    {
    }
  
  
  
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
          return this._prelevementInterbancaireService.getPrelevementRemiseById(route.paramMap.get('id')).pipe(
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