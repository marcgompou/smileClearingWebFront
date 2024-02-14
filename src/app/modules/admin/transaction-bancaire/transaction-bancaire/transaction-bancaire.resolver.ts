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
        private _transactionService: ValiderTransactionService,
      private _router: Router)
    {
    }
  
  
  
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
      const today = new Date();

      // Set the time to the beginning of the day (0:00:00)
      today.setHours(0, 0, 0, 0);

      // Calculate the end of the day (23:59:59)
      const endOfDay = new Date(today);
      endOfDay.setHours(23, 59, 59, 999);
      const dateDebut = today.toISOString();
      const dateFin = endOfDay.toISOString();
        
        return this._transactionService.getTransaction(dateDebut,dateFin);

         
    }
  
  }