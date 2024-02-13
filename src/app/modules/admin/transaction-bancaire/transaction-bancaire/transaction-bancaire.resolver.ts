import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable } from 'rxjs';
import { ValiderTransactionService } from './transaction-bancaire.service';
//import { ValiderRemiseService } from './valider-remise.service';



@Injectable({
    providedIn: 'root'
  })
  export class LoadPrelevRemiseByIdResolver implements Resolve<boolean> {
    /**
       * Constructor
       */
    constructor(
        private _prelevementService: ValiderTransactionService,
      private _router: Router)
    {
    }
  
  
  
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
          return this._prelevementService.getTransactionRemiseById(route.paramMap.get('id')).pipe(
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