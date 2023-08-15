import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject} from 'rxjs';
import { ListComponent } from '../list/list.component';
import { FuseAlertType } from '@fuse/components/alert';
import { Utilisateurs } from '../utilisateurs.types';
import { UtilisateursService } from '../utilisateurs.service';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector       : 'app-create',
    templateUrl    : './create.component.html',
    
  styleUrls: ['./create.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations     : fuseAnimations,
})
export class UtilisateursCreateComponent implements OnInit, OnDestroy
{
    
    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    @ViewChild('createUserNgForm') createUserNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    createUserForm: UntypedFormGroup;
    showAlert: boolean = false;


    
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _utilisateursService: UtilisateursService,
        private _utilisateursListComponent: ListComponent,
        private _formBuilder: UntypedFormBuilder,
        private _activatedRoute: ActivatedRoute,
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
        this.createUserForm = this._formBuilder.group({
            email     : [null, [Validators.required, Validators.email]],
            nom     : [null, [ Validators.required,Validators.maxLength(50),Validators.minLength(2)]],
            prenom  : [null, [Validators.required,Validators.maxLength(150),Validators.minLength(2)]],
            numeroTel  : [null, [Validators.required,Validators.maxLength(100),Validators.minLength(2)]],
            fonction : [null, [Validators.required,Validators.maxLength(100),Validators.minLength(2)]],
            idEntreprise  : [null, [Validators.required,Validators.maxLength(100),Validators.minLength(2)]],
          //  isConfirme  : [null, [Validators.required,Validators.maxLength(100),Validators.minLength(2)]],
          //  typeMfa  : [null, [Validators.required,Validators.maxLength(100),Validators.minLength(2)]],
          //  token  : [null, [Validators.required,Validators.maxLength(100),Validators.minLength(2)]],
           // statut  : [null],
           // userRoles  : [null],
           // statutMfa  : [null],

        });
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

    creer():void{
        if ( this.createUserForm.invalid )
        {
        return;
        }

        // Disable the form
        this.createUserForm.disable();

        // Hide the alert
        this.showAlert = false;

        const Utilisateur = {
          email: this.createUserForm.value.email,
          nom: this.createUserForm.value.nom,
          prenom: this.createUserForm.value.prenom,
          numeroTel: this.createUserForm.value.numeroTel,
          identreprise: this.createUserForm.value.identreprise,
          fonction: this.createUserForm.value.fonction,
          typeMfa: 1 ,
          token  : "",
          statut  : true,
          userRoles  : [1],
          statutMfa  : false,
          isConfirme : false,
          password:"",
        } as unknown as Utilisateurs;

       this._utilisateursService.createUtilisateur(
        Utilisateur
        ).subscribe({
            next: (response) => {
                this.alert = {
                    type: 'success',
                    message: "Client Email: "+ response.email +" enregistré."
                };
                this.showAlert = true;
                // Re-enable the form
                this.createUserForm.enable();
                // Reset the form
                this.createUserNgForm.resetForm();
                //update Client list
                this._utilisateursService.getUtilisateurs().pipe().subscribe();

                //details 
                this._router.navigate(['../../',response.id], {relativeTo: this._activatedRoute});
                
                this._changeDetectorRef.detectChanges();
            }, error: (error) => {
                console.error('Error : ', JSON.stringify(error));
                // Re-enable the form
                this.createUserForm.enable();
                // Reset the form
                this.createUserNgForm.resetForm();
                // Set the alert
                this.alert = { type: 'error', message: error.error.message??error.error };
                // Show the alert
                this.showAlert = true;
                this._changeDetectorRef.detectChanges();
            }
        });
    }

    annuler(): void {
        this.showAlert = false;
        // Re-enable the form
        this.createUserForm.enable();
        // Reset the form
        this.createUserNgForm.resetForm();
        this._changeDetectorRef.detectChanges();
    }

    closeForm():void{
        this._router.navigate(['../../'], {relativeTo: this._activatedRoute});
        this._utilisateursListComponent.matDrawer.close();
    }
    /**
    * Close the drawer
    */
    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._utilisateursListComponent.matDrawer.close();
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