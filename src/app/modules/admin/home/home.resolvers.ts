import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { HomeService } from './home.service';

@Injectable({
    providedIn: 'root'
})
export class HomeResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _homeService: HomeService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        // Get the current date
        const today = new Date();

        // Set the time to the beginning of the day (0:00:00)
        today.setHours(0, 0, 0, 0);

        // Calculate the end of the day (23:59:59)
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        // Format the dates as strings (assuming you want them in a specific format)
        const dateDebut = today.toISOString();
        const dateFin = endOfDay.toISOString();

        console.log("dateDebut:", dateDebut);
        console.log("dateFin:", dateFin);
        return this._homeService.getDataDashboard(dateDebut,dateFin);
    }

    
}


@Injectable({
    providedIn: 'root'
})
export class EntreprisesForStatResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _homeService: HomeService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        return this._homeService.getEntreprises();
    }

    
}
