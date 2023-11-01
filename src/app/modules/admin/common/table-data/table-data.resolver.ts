import { Injectable } from '@angular/core';
import {
    Resolve,
    ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { TableDataService } from '../../common/table-data/table-data.services';

/**
Permet de charger toutes 
les données sans pagination

**/
@Injectable({
    providedIn: 'root'
})
export class LoadDataResolver implements Resolve<boolean> {
    /**
     * Constructor
     */
    constructor( private _tableDataService: TableDataService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<any> {

        this._tableDataService._endpoint = route.data['endpoint'];
        this._tableDataService._id = route.params?.id;
        this._tableDataService._hasPagination = true;
        return this._tableDataService.getDatas();
    }
}


/** 
Permet de charger 
toutes les données sans pagination
**/
@Injectable({
    providedIn: 'root'
})
export class LoadSansPaginationDataResolver implements Resolve<boolean> {
    /**
     * Constructor
     */
    constructor( private _tableDataService: TableDataService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<any> {

        this._tableDataService._endpoint = route.data['endpoint'];
        this._tableDataService._id = route.params?.id;
        this._tableDataService._hasPagination = false;
        return this._tableDataService.getDatas();
    }
}


