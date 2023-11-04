import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject,takeUntil } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { Compte, } from 'app/modules/admin/compte/compte/compte.types';
import { CompteService } from 'app/modules/admin/compte/compte/compte.service';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { MatTableDataSource } from '@angular/material/table';
//import { WorkflowDefinition } from '../../workflow.definition';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { ResponseContrat } from 'app/modules/admin/common/contrat/response.type';
import { CreateComponent } from 'app/modules/admin/common/create/create/create.component';

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
    _dataSource: MatTableDataSource<Compte>;
   

    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    /**compte */
    _compte:Compte[] = [];
    //utilisateur connecté
    _connectedUser: User;
    _nombreUser=0;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
/**tableau* */


public dataStructure=[

    {
        "key":"designation",
        "label":"Designation entreprise"
    },

    {
        "key":"banque",
        "label":"Banque"
    },
    {
        "key":"compte",
        "label":"Compte"
    },
    {
        "key":"agence",
        "label":"Agence"
    },
    {
        "key":"cleRib",
        "label":"cleRib"
        
    },
    {
        "key":"agenceRemettant",
        "label":"Agence Remettant"
    },

    {
        "key":"statut",
        "label":"Etat"
    }

];




  public  displayedColumns: string[] = ['designation', 'banque','agence' ,'compte','cleRib','agenceRemettant','statut'];


  


openCreateComponent(component:CreateComponent){

    component.matDrawer=this.matDrawer;
    component.endpoint="compteClient";
    component.formTitle = "COMPTE";
    component.constructorPayload = Compte.constructorCompte;
    component.formFields=[
        {
            key:"banque",
            libelle:"Code Banque",
            validators:{
                min:5,
                max:5,
                required:true,
                // required:true
                //regex
            }

        },
        {
            key:"agence",
            libelle:"Code Agence",
            //type:"number",
           // maxlengh:5,
           placeholder:"Ex: 01001",
            validators:{
                min:5,
                max:5,
                required:true,
                // required:true
                //regex
            }

        },
        {
            key:"compte",
            libelle:"Compte",
            validators:{
                min:12,
                max:12,
                required:true,
            }

        },

        {
            key:"cleRib",
            libelle:"cle Rib",
            
            validators:{
                min:2,
                max:2,
                required:true,
            }

        },

        {
            key:"designation",
            libelle:"libelle du compte",
            validators:{
                min:2,
                max:50,
                required:true,
              //  email:true
            }

        },

        {
            key: 'identreprise',
            libelle: 'Entreprise',
            type: 'select',
           
            options : [
                
                { "value": 1000, "libelle": "BRIDGE" },
                { "value": 2000, "libelle": "TUNNEL" },
                { "value": 3000, "libelle": "HIGHWAY" },
                { "value": 4000, "libelle": "RAILWAY" },
                { "value": 5000, "libelle": "VIADUCT" }
              ],
            validators: { required: true },
          },

          {
            key:"agenceRemettant",
            libelle:"Agence remettant",
            validators:{
                min:5,
                max:5,
                required:true,
              //  email:true
            }

        }

    ]
}
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _compteService: CompteService,
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

        // Get the Comptes
      //  this.getCompte();

        // get user
        this.getConnectedUser();

    }

    /**
     * After view init
     */
    ngAfterViewInit(): void
    {   
        if(this._dataSource!=null && this._dataSource.filteredData!=null){
            if(this._dataSource.filteredData.length){
                this._dataSource.sort = this._sort;
                this._dataSource.paginator = this._paginator;
                this._changeDetectorRef.detectChanges();
            }
            
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
    selctedRow(row:Compte){
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
    getCompte():void{
        this._compteService.compte$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((response: any) => {

            // Update the compte
            this._compte = response.result.data;
            console.log('response========================');
            console.log(response.result.data);
            this._dataSource = new MatTableDataSource(response.result.data);
            this._nombreUser = response.totalCount;
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






