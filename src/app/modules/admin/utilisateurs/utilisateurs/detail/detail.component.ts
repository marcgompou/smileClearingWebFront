import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject, takeUntil } from 'rxjs';
import { ListComponent } from '../list/list.component';
import { UtilisateursService } from '../utilisateurs.service';
import { Utilisateurs } from '../utilisateurs.types';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'app/core/user/user.types';
//import { Transition } from 'app/modules/admin/common/transition/transition.model';
import { UserService } from 'app/core/user/user.service';
//import { WorkflowDefinition } from '../../workflow.definition';
//import { DeleteConfirmationComponent } from './delete-confirmation/delete-confirmation.component';

@Component({
    selector       : 'app-detail',
    templateUrl    : './detail.component.html',
    styleUrls: ['./detail.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations     : fuseAnimations
})
export class DetailComponent implements OnInit, OnDestroy
{
    //client connecté
    _connectedUser: User;
    //list des transitions possibles à exécutée
   // _transitions: Transition[];
    //le client à affiché
    _utilisateurs:any = {} as Utilisateurs;

    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    editMode: boolean = false;
    
    isLoading: boolean = false;    
    
    
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _utilisateursService:UtilisateursService,
        private _userService: UserService,
        private _utilisateursListComponent: ListComponent,
        public _dialog:MatDialog,
        private _router: Router,
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
        // Open the drawer
        this._utilisateursListComponent.matDrawer.open();

        // get client by id
        this.getClientById();

        // get user connected user
        this.getConnectedUser();

    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();

        // Dispose the overlays if they are still on the DOM
        if ( this._tagsPanelOverlayRef )
        {
            this._tagsPanelOverlayRef.dispose();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    /**
     * Can edit
     */
    canEdit():boolean{
    return false
      //return (this._connectedUser && this._connectedUser.roles.includes(WorkflowDefinition.ROLES.DemandeurCreationClient) && this._utilisateurs.creationUser===this._connectedUser.email);
    }
    /**
     * Recupérer les informations du client
     */
    getConnectedUser(): void {
        // Subscribe to user changes
        this._userService.user$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((user: User) => {
            this._connectedUser = user;
            // Mark for check
            this._changeDetectorRef.detectChanges();
        });
    }
    /**
     * 
     */
    getClientById():void{
        this._utilisateursService.client$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((client:Utilisateurs) => {

            // Update the client
            this._utilisateurs = client;

            this.getTransitions(this._utilisateurs.etat);

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }


    /**
     * event executer apres la transition
     * @param object 
     */
    updateAfterTransitionActionObject(object:Utilisateurs) {

        this._utilisateurs = object;

        //get new transition
        this.getTransitions(this._utilisateurs.etat);

        //update client liste
        this._utilisateursService.getUtilisateurs().pipe().subscribe();

        this._changeDetectorRef.detectChanges();
    }

    /**
     * 
     */
    supprimer(): void {
      /*  const deleteObjectDialog = this._dialog.open(
            DeleteConfirmationComponent,
            {
                data: {
                    object: this._utilisateurs,
                }
            }
        );*/
     /*   deleteObjectDialog.afterClosed().subscribe(resultat => {
            if (resultat && resultat.isDeleted) {
                //update client liste
                this._utilisateursService.getUtilisateurs().pipe().subscribe();
                this._router.navigate(['../'], { relativeTo: this._activatedRoute });
            }
        });*/
    }

    /**
     * Récuperer la couleur de l'état
     * @param etat 
     * @returns 
     */
   // getEtatColor(etat:string):string|undefined{
      return 
      //  return WorkflowDefinition.getEtatColor(etat);
   // }

    /**
     * Récuperer la liste des transitions
     * @param etat 
     */
    getTransitions(etat: string): void {
       // this._transitions = WorkflowDefinition.getTransitions(etat);
        this._changeDetectorRef.detectChanges();
    }

    /**
    * Close the drawer
    */
    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._utilisateursListComponent.matDrawer.close();
    }

    toggleEditMode(edit:boolean){
        this.editMode = edit;
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

