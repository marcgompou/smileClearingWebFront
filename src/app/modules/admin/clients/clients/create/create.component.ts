import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject} from 'rxjs';
import { ListComponent } from '../list/list.component';
import { FuseAlertType } from '@fuse/components/alert';
import { Clients } from '../clients.types';
import { ClientsService } from '../clients.service';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector       : 'app-create',
    templateUrl    : './create.component.html',
    
  styleUrls: ['./create.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations     : fuseAnimations,
})
export class ClientsCreateComponent implements OnInit, OnDestroy
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
        private _clientsService: ClientsService,
        private _clientsListComponent: ListComponent,
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
        this._clientsListComponent.matDrawer.open();
        this.createUserForm = this._formBuilder.group({
            email     : [null, [Validators.required, Validators.email]],
            nom     : [null, [ Validators.required,Validators.maxLength(50),Validators.minLength(2)]],
            prenom  : [null, [Validators.required,Validators.maxLength(150),Validators.minLength(2)]],
            site  : [null, [Validators.required,Validators.maxLength(100),Validators.minLength(2)]],
            structure  : [null, [Validators.required,Validators.maxLength(100),Validators.minLength(2)]],
            fonction : [null, [Validators.required,Validators.maxLength(100),Validators.minLength(2)]]
,        });
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

        const Client = {
          email: "",
          nom: this.createUserForm.value.nom,
          prenom: this.createUserForm.value.prenom,
          site: this.createUserForm.value.site,
          structure: this.createUserForm.value.structure,
          fonction: this.createUserForm.value.fonction,
        } as unknown as Clients;

       this._clientsService.createClient(
            Client
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
                this._clientsService.getClients().pipe().subscribe();

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
        this._clientsListComponent.matDrawer.close();
    }
    /**
    * Close the drawer
    */
    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._clientsListComponent.matDrawer.close();
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
