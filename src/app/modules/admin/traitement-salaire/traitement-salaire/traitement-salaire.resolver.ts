import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable } from 'rxjs';
import { TraitementSalaireService } from './traitement-salaire.service';


@Injectable({
    providedIn: 'root'
})
export class LoadPrelevATraiterByIdResolver implements Resolve<boolean> {
    /**
       * Constructor
       */
    constructor(
        private _traitementSalaireService: TraitementSalaireService,
        private _router: Router) {
    }



    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this._traitementSalaireService.getSalaireATraiter(route.paramMap.get('id')).pipe(
            // Error here means the requested product is not available
            catchError((error) => {
                console.error("--------------------------error resolver LoadPrelevRemiseByIdResolver-----------", error);
                // Navigate to there
                this._router.navigateByUrl("home");
                // Throw an error
                throw error;
            })
        );
    }

}