import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  Router
} from '@angular/router';
import { catchError, Observable } from 'rxjs';
import { DetailsService } from './details.service';






@Injectable({
  providedIn: 'root'
})
export class LoadDetailsResolver implements Resolve<boolean> {
  /**
     * Constructor
     */
  constructor(
    private _detailService:DetailsService,
    private _router: Router)
  {
  }



  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
  {
        let endpoint = route.data['endpoint']; 
        return this._detailService.getById(route.paramMap.get('id'),endpoint).pipe(
            // Error here means the requested product is not available
            catchError((error) => {

                // Log the error
                console.error(error);
                console.error(`Could not find endpoint ${endpoint}`);
                // Get the parent url
                const parentUrl = state.url.split('/').slice(0, -1).join('/');
                this._detailService.setId(null);
                // Navigate to there
                this._router.navigateByUrl(parentUrl);

                // Throw an error
                throw error;
            })
        );
  }

}





