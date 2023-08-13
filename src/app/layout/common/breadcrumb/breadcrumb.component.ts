import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { appConfig } from 'app/core/config/app.config';
import { Subject, takeUntil } from 'rxjs';
import { BreadcrumbService } from './breadcrumb.service';

export interface Breadcrumb {
    label: string;
    url: string;
}

@Component({
    selector: 'breadcrumb',
    templateUrl: './breadcrumb.component.html',
    encapsulation: ViewEncapsulation.None
})
export class BreadcrumbComponent implements OnInit {

    appName: string = appConfig.name;
    breadcrumbs: Breadcrumb[];
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(private readonly breadcrumbService: BreadcrumbService) {

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to config changes
        this.breadcrumbService.breadcrumbs$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((breadcrumbs: Breadcrumb[]) => {
            console.log('breadcrumbs', breadcrumbs);
            // Store the config
            this.breadcrumbs = breadcrumbs;
        });
    }

}
