import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable } from 'rxjs';
import { WebsocketService,Message } from 'app/core/websocket/websocket.service';
import { CompteEntreprises } from '../cheque.type';
import { CreerRemiseService } from '../remise-aller/remise.service';

//import { Message } from 'app/layout/common/messages/messages.types';


@Injectable({
    providedIn: 'root'
})
export class ScannerConnexionResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _websocketService: WebsocketService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    {
        let message:Message ={'action':'CONNECT','command':'StartScanner',}
        this._websocketService.messages.next(message);
        //return this._utilisateursService.getUtilisateurs();
    }
}

@Injectable({
    providedIn: 'root'
})
export class LoadDataCompteEntrepriseResolver implements Resolve<boolean> {
    /**
     * Constructor
     */
    constructor( private _compteEntreprises: CreerRemiseService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        return this._compteEntreprises.getCompteByEntreprise();
    }

}