import { Injectable } from '@angular/core';
import {
    Resolve,
    ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { TableDataService } from '../../common/table-data/table-data.services';


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
        console.log("=====>",route.data['endpoint']);
        return this._tableDataService.getDatas();
    }
}