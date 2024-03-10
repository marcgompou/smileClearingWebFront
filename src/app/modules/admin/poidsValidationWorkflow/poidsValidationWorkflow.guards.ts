import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { DetailsComponent } from '../common/details/details/details.component';
//import { DetailComponent } from 'app/modules/admin/compte/compte/detail/detail.component';// importer le component afin de l'utiliser dans le code

@Injectable({
    providedIn: 'root'
})
export class CanDeactivatePoidsValidationWorkflowDetails implements CanDeactivate<DetailsComponent>
{
    canDeactivate(
        component: DetailsComponent,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
    {
        // Get the next route
        let nextRoute: ActivatedRouteSnapshot = nextState.root;
        while ( nextRoute.firstChild )
        {
            nextRoute = nextRoute.firstChild;
        }

        // If the next state doesn't contain '/contacts'
        // it means we are navigating away from the
        // contacts app
        if ( !nextState.url.includes('/compteClientAfb') )
        {
            // Let it navigate
            return true;
        }

        // If we are navigating to another contact...
        if ( nextRoute.paramMap.get('id') )
        {
            // Just navigate
            return true;
        }
        // Otherwise...
        else
        {

            // Close the drawer first, and then navigate
            return component.closeDrawer().then(() => true);
        }
    }
}
