import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, filter, map, switchMap, takeUntil } from 'rxjs';
// import { fuseAnimations } from '@fuse/animations';
import { Utilisateurs, } from 'app/modules/admin/neoapps/utilisateurs/utilisateurs/utilisateurs.types';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { MatTableDataSource } from '@angular/material/table';
//import { WorkflowDefinition } from '../../workflow.definition';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { DetailsComponent } from 'app/modules/admin/common/details/details/details.component';
import { TableDataService } from 'app/modules/admin/common/table-data/table-data.services';
import { EntrepriseService } from 'app/modules/admin/entreprise/entreprise/entreprise.service';
import { UtilisateursService } from '../utilisateurs.service';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    animations: fuseAnimations
})
export class ListComponent implements OnInit,OnDestroy {

    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    drawerMode: 'side' | 'over';

    /**DataTable */
    selectedRowIndex: any;
    _dataSource: MatTableDataSource<Utilisateurs>;
    private _searchTerms = new Subject<string>();
    _displayedColumns: string[] = ['dateCreation', 'email', 'prenom','nom', 'fonction', 'nomEntreprise','statut','emailConfirmed'];
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
            "key": "nomEntreprise",
            "label": "Entreprise"
        },
        {
            "key": "statut",
            "type":"status",
            "label": "Statut",
            "statusValues":[
              {value:false,libelle:"Désactivé",color:"#F56565"},
              {value:true,libelle:"Activé",color:"#68D391"}
          ]
        },
        {
          "key": "emailConfirmed",
          "type":"status",
          "label": "Confirmation Email",
          "statusValues":[
            {value:false,libelle:"Non confirmé",color:"#F56565"},
            {value:true,libelle:"Confirmé",color:"#68D391"}
        ]
      },
        
    ];


    /**utilisateurs */
    _utilisateurs: Utilisateurs[] = [];
    _entreprises:any[];
    //utilisateur connecté
    _connectedUser: User;
    _nombreUser = 0;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    _filterObject:any={criteria:""};
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _entrepriseService: EntrepriseService, //TODO A remplacer par entreprise service
        private _tableDataService: TableDataService,
        private _utilisateurService:UtilisateursService,
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


        this._searchTerms
      .pipe(
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
      )
      .subscribe(() => {
        // Perform any additional actions after the data is retrieved.
        this._changeDetectorRef.detectChanges();
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
        this._entrepriseService.entreprises$.pipe(
          takeUntil(this._unsubscribeAll)
         
        ).subscribe({
            next: (response:any) => {
            console.log("Response===> :", response);
            
                this._entreprises=response.data.map((element:any) => { return {"libelle":element.nomEntreprise,"value":element.identreprise}});
                console.log("====entreprises=====>",this._entreprises)
                this._changeDetectorRef.markForCheck();
            }, 
            error: (error) => {   
                console.error('Error : ', JSON.stringify(error));         
                this._changeDetectorRef.markForCheck();
            }
        });


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
      this._searchTerms.next(query);
    }

    reinitialiserUser(id:string){
      
      console.log("call custom function id===>",id);
      this._utilisateurService.resetPasswordUtilisateur(id).subscribe({
        
      });
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
            key: "identreprise",
            libelle: "Entreprise",
            type:"select",
            options: this._entreprises,
            validators: {
              max: 100,
            }
          },
          {
            key: "userRoles",
            libelle: "Roles",
            type:"select",
            multiple:true,
            options:['CHARG_PRELEVEMENT','VISUALISATION','EXPORTATION','VALID_PRELEVEMENT','VALIDATION','SUPERADMIN','CREATION','ADMIN','VALID_PRELEVEMENT_INTER_BANK','CONSULT_AFB120','CHARG_PRELEVEMENT_INTER_BANK','CHARG_SALAIRE','CONSULT_VALEUR_SALAIRE','CONSULT_SALAIRE','VALID_SALAIRE'],
            validators: {
              max: 130,
              required: true,
            }
          },
          {
            key: "statut",
            libelle: "Statut",
            type: "select",
            disabled:true,
            writeInCreate:false,
            options: [{ value: false, libelle: "Désactivé" }, { value: true, libelle: "Activé" }],
          }
        ];
        component.actionsButtons = [
          
          {
            label: 'Reinitialiser',
            color:'primary',
            icon:'heroicons_outline:refresh',
            confirmationTitle:"Réinitialisation du compte utilisateur",
            endpoint: 'Authentication/reset',
            actionType:'update'
          }
        ]
          
    };

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






