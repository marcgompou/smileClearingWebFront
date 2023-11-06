import {  ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, filter, switchMap, takeUntil } from 'rxjs';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
//import { DetailsComponent } from 'app/modules/admin/common/details/details/details.component';
import { Entreprise } from '../entreprise.types';
import { TableDataService } from 'app/modules/admin/common/table-data/table-data.services';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    drawerMode: 'side' | 'over';
    _filterObject:any={criteria:""}
    private _searchTerms = new Subject<string>();

    _displayedColumns: string[] = ['dateCreation','nomEntreprise', 'descriptionActivite','statut'];
    dataStructure = [
        {
            "key": "dateCreation",
            "label": "Date de création",
            "type":"date"
        },
        {
            "key": "descriptionActivite",
            "label": "Description activité"
        },
        {
            "key": "statut",
            "label": "Statut",
            "type":"status",
            "statusValues":[
                {value:1,libelle:"Actif",color:"#68D391"},
                {value:0,libelle:"Désactivé",color:"#F56565"}
            ]
        },
        {
            "key": "nomEntreprise",
            "label": "Entreprise"
        },
    ];

    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _tableDataService: TableDataService,
        private _fuseMediaWatcherService: FuseMediaWatcherService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to MatDrawer opened change
        this.matDrawer.openedChange.subscribe((opened) => {
            if (!opened) {
                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Set the drawerMode if the given breakpoint is active
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                }
                else {
                    this.drawerMode = 'over';
                }
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });



            this._searchTerms.pipe(
                    debounceTime(300), // Adjust the debounce time (in milliseconds) as needed
                    distinctUntilChanged(),
                    // Ignore if the new term is the same as the previous term
                    filter((term: string) => !(term.startsWith('[') && !term.endsWith(']'))), // Filter out undesired terms
                    switchMap((term: string) => {
                        this._filterObject={ criteria: term }
                        this._tableDataService._filterObject = { criteria: term };
                        this._tableDataService._hasPagination = true;
                        this._tableDataService._paginationObject = {
                            page: 0,
                            size: 10
                        };
                        return this._tableDataService.getDatas();
                    })
                ).subscribe(() => {
                    // Perform any additional actions after the data is retrieved.
                    this._changeDetectorRef.detectChanges();
                });
    }



    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    /**
     * 
     * @param event 
     */
    applyFilter(event: Event): void {
        const query = (event.target as HTMLInputElement).value;
        this._searchTerms.next(query);

        this._changeDetectorRef.detectChanges();
    }




    /**
     * On backdrop clicked
     */
    onBackdropClicked(): void {
        // Go back to the list
        this._router.navigate(['./'], { relativeTo: this._activatedRoute });

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    //This is run for common DetailsComponent and common CreateComponent
    openDetailComponent(component: any) {

        console.log("===component==>",component);
        component.matDrawer = this?.matDrawer;
        component.formTitle = "Entreprise";
        component.loadDataOnInit = true;
        component.endpoint = "entreprises";
        component.constructorPayload = Entreprise.constructorEntreprise
        component.formFields = [
            {
                key: "nomEntreprise",
                libelle: "Nom Entreprise",
                placeholder: "neo corporation",
                validators: {
                    max: 100,
                    required: true,
                }
            },
            {
                key: "descriptionActivite",
                libelle: "Description activité",
                validators: {
                    max: 255,
                    required: true,
                }
            },
            {
                key: "dateCreation",
                libelle: "Date de création",
                disabled:true,
                type: "datetime",
                writeInCreate:false,
            },
            {
                key: "statut",
                libelle: "Statut",
                type: "select",
                disabled:true,
                writeInCreate:false,
                options: [{ value: 1, libelle: "Actif" }, { value: 0, libelle: "Désactivé" }],
            }
        ];
    };

}






