import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject, takeUntil} from 'rxjs';
import { ListComponent } from '../list/list.component';
import { FuseAlertType } from '@fuse/components/alert';
import { Utilisateurs } from '../utilisateurs.types';
import { UtilisateursService } from '../utilisateurs.service';
import { fuseAnimations } from '@fuse/animations';
import { TableDataService } from 'app/modules/admin/common/table-data/table-data.services';
import { EntrepriseService } from 'app/modules/admin/entreprise/entreprise/entreprise.service';

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
    isNotUserAdmin=true;
    rolesList: string[] =  ['CHARG_PRELEVEMENT','VISUALISATION','EXPORTATION','VALID_PRELEVEMENT','VALIDATION','SUPERADMIN','CREATION','ADMIN','VALID_PRELEVEMENT_INTER_BANK','CHARG_AFB120','CHARG_PRELEVEMENT_INTER_BANK','CHARG_SALAIRE','CONSULT_SALAIRE','CONSULT_VALEUR_SALAIRE','VALID_SALAIRE'];
    disabledOptions:string[]=[];
    rolesForNonAdmin=['CHARG_PRELEVEMENT','EXPORTATION','VALID_PRELEVEMENT','VALIDATION','CREATION','VALID_PRELEVEMENT_INTER_BANK','CHARG_AFB120','CHARG_PRELEVEMENT_INTER_BANK','CHARG_SALAIRE','VALIDATION_SALAIRE'];
    rolesUniversel=['CONSULT_SALAIRE','CONSULT_VALEUR_SALAIRE'];
   
    entreprises: any[];

   
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _utilisateursService: UtilisateursService,
        private _entrepriseService:EntrepriseService,
        private _tableDataService: TableDataService,
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
            identreprise  : [null, [Validators.required]],
            roles:[null,[Validators.required]],
            operateur:[null,[]],


        });
        this.loadEntreprises();
        this.createUserForm.get('operateur').disable();
        this.createUserForm.get('roles').valueChanges.subscribe((selectedValue) => {

            let roles:string[] = selectedValue;
            //Si admin ou superadmin coché tous les autres sont ROLES SONT DESELECTIONNE ET  désactivé sauf (visualisation)

                    //Operateur devient required

                    //entreprise est desactivé et a la valeur par defaut;
            if(roles?.includes("SUPERADMIN") || roles?.includes("ADMIN"))
            {
                this.createUserForm.get('operateur').setValidators([Validators.required,Validators.maxLength(4),Validators.minLength(3)]);
                this.createUserForm.get('operateur').enable();

                this.createUserForm.get('identreprise').setValue("0");
                this.createUserForm.get('identreprise').disable();

                
                //Deselectionner les roles selectionné

                
                const elementsToRemove = this.rolesForNonAdmin;

                elementsToRemove.forEach((element) => {
                const index = roles.indexOf(element);
                if (index !== -1) {
                    roles.splice(index, 1);
                }
                });
                //this.createUserForm.get('roles').setValue(roles);
                this.disabledOptions=this.rolesForNonAdmin ;


            }else{
                this.createUserForm.get('operateur').clearValidators();
                this.createUserForm.get('operateur').disable();
                this.createUserForm.get('identreprise').enable();
                this.createUserForm.get('identreprise').setValidators([Validators.required]);
                this.disabledOptions=[];

                this._changeDetectorRef.detectChanges();

            }

            
            console.log("===roles===>",roles);

        });

      



    }

    isOptionDisable(optionValue):boolean{

        return this.disabledOptions.includes(optionValue);
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
        //this.createUserForm.disable();

        // Hide the alert
        this.showAlert = false;

        const utilisateur = Utilisateurs.constructorUtilisateur(this.createUserForm.value);
        // const utilisateur = {
        //   email: this.createUserForm.value.email,
        //   nom: this.createUserForm.value.nom,
        //   prenom: this.createUserForm.value.prenom,
        //   numeroTel: this.createUserForm.value.numeroTel,
        //   identreprise: this.createUserForm.value.identreprise,
        //   fonction: this.createUserForm.value.fonction,
        //   typeMfa: 1 ,
        //   token  : "",
        //   statut  : true,
        //   roles  :this.createUserForm.value.roles,
        //   statutMfa  : false,
        //   isConfirme : false,
        //   password:"",
        //   operateur: this.createUserForm.value.operateur||"----"
        // } ;
        console.log(utilisateur)

        
       this._utilisateursService.createUtilisateur(
        utilisateur
        ).subscribe({
            next: (response) => {
                this.alert = {
                    type: 'success',
                    message:  response.message 
                };
                this.showAlert = true;
                // Re-enable the form
                this.createUserForm.enable();
                // Reset the form
                this.createUserNgForm.resetForm();
                //update Client list
                // this._utilisateursService.getUtilisateurs().pipe().subscribe();
                this._tableDataService.getDatas().pipe().subscribe();
                //details 
                this._router.navigate(['../',response.id], {relativeTo: this._activatedRoute});
                
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
        this._router.navigate(['../'], {relativeTo: this._activatedRoute});
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


    loadEntreprises(){

        this._entrepriseService.entreprises$.pipe(takeUntil(this._unsubscribeAll)
            ).subscribe({
                next: (response:any) => {
                console.log("Response===> :", response);
                    this.entreprises=response.data;
                    this._changeDetectorRef.markForCheck();
                }
            });
    
        }
}