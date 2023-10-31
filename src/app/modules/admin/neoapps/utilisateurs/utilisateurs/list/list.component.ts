import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { Utilisateurs, } from 'app/modules/admin/neoapps/utilisateurs/utilisateurs/utilisateurs.types';
import { UtilisateursService } from 'app/modules/admin/neoapps/utilisateurs/utilisateurs/utilisateurs.service';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { MatTableDataSource } from '@angular/material/table';
//import { WorkflowDefinition } from '../../workflow.definition';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { ResponseContrat } from 'app/modules/admin/common/contrat/response.type';
import { DetailsComponent } from 'app/modules/admin/common/details/details/details.component';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit,OnDestroy {

    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    drawerMode: 'side' | 'over';

    /**DataTable */
    selectedRowIndex: any;
    _dataSource: MatTableDataSource<Utilisateurs>;
    
    _displayedColumns: string[] = ['dateCreation', 'email', 'prenom','nom', 'fonction', 'identreprise'];
    dataStructure = [
       
        {
            "key": "dateCreation",
            "label": "Date de création",
            "type":"date"
        },
        {
            "key": "email",
            "label": "Email"
        },
        {
            "key": "prenom",
            "label": "Prenom"
        },
        {
            "key": "nom",
            "label": "Nom"
        },
        {
            "key": "fonction",
            "label": "Fonction"
        },
        {
            "key": "identreprise",
            "label": "Entreprise"
        },
    ];


    /**utilisateurs */
    _utilisateurs: Utilisateurs[] = [];
    //utilisateur connecté
    _connectedUser: User;
    _nombreUser = 0;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _userService: UserService,
        private _utilisateursService: UtilisateursService,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
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
            }
            );



        // get user
        this.getConnectedUser();

    }

    /**
     * After view init
     */

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
        this._dataSource.filter = query.trim().toLowerCase();
        this._changeDetectorRef.detectChanges();
    }

    /**
     * Can create
     */
    canCreate(): boolean {
        return true
        //  return this._connectedUser.roles.includes(WorkflowDefinition.ROLES.DemandeurCreationUtilisateur);
    }

    //Affichage des details
    openDetailComponent(component: DetailsComponent) {


        component.matDrawer = this?.matDrawer;
        component.formTitle = "INFORMATIONS UTILISATEUR";
        component.loadDataOnInit=true;
        //Endpoint pour supprimer un cheque
        component.endpoint="users";
        component.constructorPayload=Utilisateurs.constructorUtilisateur
        //Initialisation formulaire details
        component.formFields = [
          {
            key: "email",
            libelle: "Email",
            placeholder: "user@example.com",
            validators: {
              max: 150,
              email:true,
              required: true,
            }
          },
          {
            key: "nom",
            libelle: "Nom",
            validators: {
              max: 130,
              required: true,
            }
          },
          {
            key: "prenom",
            libelle: "Prenom",
            validators: {
              max: 130,
              required: true,
            }
          },

          {
            key: "fonction",
            libelle: "Fonction",
            validators: {
              max: 130,
              required: true,
            }
          },
          {
            key: "UserRoles",
            libelle: "Roles",
            type:"select",
            multiple:true,
            options:['CHARG_PRELEVEMENT','VISUALISATION','EXPORTATION','VALID_PRELEVEMENT','VALIDATION','SUPERADMIN','CREATION','ADMIN'],
            validators: {
              max: 130,
              required: true,
            }
          },
          // {
          //   key: "UserRoles",
          //   libelle: "Roles",
          //   type:"select",
          //   options:['CHARG_PRELEVEMENT','VISUALISATION','EXPORTATION','VALID_PRELEVEMENT','VALIDATION','SUPERADMIN','CREATION','ADMIN'],
          //   validators: {
          //     max: 130,
          //     required: true,
          //   }
          // },
        ];
       
       
    };



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



    /**
     * On backdrop clicked
     */
    // onBackdropClicked(): void {
    //     // Go back to the list
    //     this._router.navigate(['./'], { relativeTo: this._activatedRoute });

    //     // Mark for check
    //     this._changeDetectorRef.markForCheck();
    // }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }



    
}






