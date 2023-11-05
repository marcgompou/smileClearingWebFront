import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject} from 'rxjs';
import { ListComponent } from '../list/list.component';
import { FuseAlertType } from '@fuse/components/alert';
import { Agence } from '../agence.types';
import { AgenceService } from '../agence.service';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector       : 'app-create',
    templateUrl    : './create.component.html',
    
  styleUrls: ['./create.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations     : fuseAnimations,
})
export class AgenceCreateComponent implements OnInit, OnDestroy
{
    
    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    @ViewChild('createAgenceNgForm') createAgenceNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    createAgenceForm: UntypedFormGroup;
    showAlert: boolean = false;


    
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _agenceService: AgenceService,
        private _agenceListComponent: ListComponent,
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
        this._agenceListComponent.matDrawer.open();
        this.createAgenceForm = this._formBuilder.group({
            codeAgence     : [null, [Validators.required,Validators.maxLength(5),Validators.minLength(5)]],
            libelle     : [null, [ Validators.required,Validators.maxLength(50),Validators.minLength(2)]],
         

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
        if ( this.createAgenceForm.invalid )
        {
        return;
        }

        // Disable the form
        this.createAgenceForm.disable();

        // Hide the alert
        this.showAlert = false;

        const Agence = {
         
          codeAgence     : this.createAgenceForm.value.codeAgence,
          libelle     : this.createAgenceForm.value.libelle,
       
        } as unknown as Agence;

       this._agenceService.createAgence(
        Agence
        ).subscribe({
            next: (response) => {
                
            console.log('response========================');
                console.log (response);
                this.alert = {
                    type: 'success',
                    message: response.message ,
                    
                };
                this.showAlert = true;
                // Re-enable the form
                this.createAgenceForm.enable();
                // Reset the form
                this.createAgenceNgForm.resetForm();
                //update Client list
                this._agenceService.get().pipe().subscribe();

                //details 
                console.log('response========================');
                console.log (response);

                this._router.navigate(['../',response.data.codeAgence], {relativeTo: this._activatedRoute});
                
                this._changeDetectorRef.detectChanges();
            }, error: (error) => {
                console.error('Error : ', JSON.stringify(error));
                // Re-enable the form
                this.createAgenceForm.enable();
                // Reset the form
                this.createAgenceNgForm.resetForm();
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
        this.createAgenceForm.enable();
        // Reset the form
        this.createAgenceNgForm.resetForm();
        this._changeDetectorRef.detectChanges();
    }

    closeForm():void{
        this._router.navigate(['../'], {relativeTo: this._activatedRoute});
        this._agenceListComponent.matDrawer.close();
    }
    /**
    * Close the drawer
    */
    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._agenceListComponent.matDrawer.close();
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
