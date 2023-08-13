import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject, takeUntil } from 'rxjs';
import { ListComponent } from '../list/list.component';
import { AgenceService } from '../agence.service';
import { Agence } from '../agence.types';
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
    _agence:any = {} as Agence;

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
        private _agenceService:AgenceService,
        private _userService: UserService,
        private _agenceListComponent: ListComponent,
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
        this._agenceListComponent.matDrawer.open();

        // get client by id
        this.getById();

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
      //return (this._connectedUser && this._connectedUser.roles.includes(WorkflowDefinition.ROLES.DemandeurCreationClient) && this._agence.creationUser===this._connectedUser.email);
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
    getById():void{
        
        this._agenceService.agence$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((agence:Agence) => {

            // Update the client
            this._agence = agence;

           // this.getTransitions(this._agence.codeAgence);

            // Mark for check
            this._changeDetectorRef.markForCheck();
            console.log ("agence===============================");
            console.log (agence);
            console.log ("agence2===============================");
        });

        
    }


    /**
     * event executer apres la transition
     * @param object 
     */
    updateAfterTransitionActionObject(object:Agence) {

        this._agence = object;

        //get new transition
        this.getTransitions(this._agence.codeAgence);

        //update client liste
        this._agenceService.get().pipe().subscribe();

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
                    object: this._agence,
                }
            }
        );*/
     /*   deleteObjectDialog.afterClosed().subscribe(resultat => {
            if (resultat && resultat.isDeleted) {
                //update client liste
                this._agenceService.getAgence().pipe().subscribe();
                this._router.navigate(['../'], { relativeTo: this._activatedRoute });
            }
        });*/
    }

    /**
     * Récuperer la couleur de l'état
     * @param codeAgence 
     * @returns 
     */
   // getcodeAgenceColor(codeAgence:string):string|undefined{
      return 
      //  return WorkflowDefinition.getcodeAgenceColor(codeAgence);
   // }

    /**
     * Récuperer la liste des transitions
     * @param codeAgence 
     */
    getTransitions(codeAgence: string): void {
       // this._transitions = WorkflowDefinition.getTransitions(codeAgence);
        this._changeDetectorRef.detectChanges();
    }

    /**
    * Close the drawer
    */
    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._agenceListComponent.matDrawer.close();
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

