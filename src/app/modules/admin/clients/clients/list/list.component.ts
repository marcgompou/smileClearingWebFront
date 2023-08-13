import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject,takeUntil } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { Clients, } from 'app/modules/admin/neoapps/clients/clients/clients.types';
import { ClientsService } from 'app/modules/admin/neoapps/clients/clients/clients.service';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { MatTableDataSource } from '@angular/material/table';
//import { WorkflowDefinition } from '../../workflow.definition';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    drawerMode: 'side' | 'over';

    /**DataTable */
    selectedRowIndex:any;
    _dataSource: MatTableDataSource<Clients>;
    _displayedColumns: string[] = ['date', 'email', 'nomComplet', 'etat'];
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    /**clients */
    _clients:Clients[] = [];
    //utilisateur connecté
    _connectedUser: User;

    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _clientsService: ClientsService,
        private _userService: UserService,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Subscribe to MatDrawer opened change
        this.matDrawer.openedChange.subscribe((opened) => {
            if ( !opened )
            {
                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {
                // Set the drawerMode if the given breakpoint is active
                if ( matchingAliases.includes('lg') )
                {
                    this.drawerMode = 'side';
                }
                else
                {
                    this.drawerMode = 'over';
                }
                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        );

        // Get the products
        this.getClients();

        // get user
        this.getConnectedUser();

    }

    /**
     * After view init
     */
    ngAfterViewInit(): void
    {   
        if(this._dataSource!=null && this._dataSource.filteredData.length){
            this._dataSource.sort = this._sort;
            this._dataSource.paginator = this._paginator;
            this._changeDetectorRef.detectChanges();
        }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
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
        this._dataSource.filter = query.trim().toLowerCase();
        this._changeDetectorRef.detectChanges();
    }
    /**
     * 
     * @param row 
     */
    selctedRow(row:Clients){
        this.selectedRowIndex = row.id;
        this._router.navigate(['./', this.selectedRowIndex], { relativeTo: this._activatedRoute });
        this._changeDetectorRef.detectChanges();
    }
    /**
     * Can create
     */
    canCreate(): boolean {
        return true
      //  return this._connectedUser.roles.includes(WorkflowDefinition.ROLES.DemandeurCreationUtilisateur);
    }
    /**
     * Recupérer les informations de l'utilisateur connecté
     */
    getConnectedUser(): void {
        // Subscribe to user changes
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this._connectedUser = user;
                // Mark for check
                this._changeDetectorRef.markForCheck();
        });
    }
    /**
     * All users
     */
    getClients():void{
        this._clientsService.clients$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((clients: Clients[]) => {

            // Update the clients
            this._clients = clients;
            this._dataSource = new MatTableDataSource(clients);

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * 
     * @param etat 
     * @returns 
     */
   /* getEtatColor(etat:string):string|undefined{
        return WorkflowDefinition.getEtatColor(etat);
    }*/

    /**
     * On backdrop clicked
     */
    onBackdropClicked(): void
    {
        // Go back to the list
        this._router.navigate(['./'], {relativeTo: this._activatedRoute});

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }  

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

}






