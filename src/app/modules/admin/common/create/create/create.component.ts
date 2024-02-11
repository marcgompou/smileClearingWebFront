import { OverlayRef } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { MatDrawer } from '@angular/material/sidenav';
import { CreateService } from '../create.service';
import { FormBuilder, FormControl, FormGroup, Validators,ValidatorFn, NgForm } from '@angular/forms';
import { FuseAlertType } from '@fuse/components/alert';
import { TableDataService } from '../../table-data/table-data.services';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations     : fuseAnimations,
})
export class CreateComponent implements OnInit {


  @Input() matDrawer!:MatDrawer;
  @Input() formFields!:any;
  @Input() constructorPayload!:(args: any) => any;
  @Input("formTitle") formTitle:string ="Formulaire création"
  @Input("endpoint") endpoint:string ;
  //@Input("placeholder") placeholder:string ;
  
  @ViewChild('formNgForm') formNgForm: NgForm;

  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  showAlert: boolean = false;

  editMode:boolean=false;
  //utilisateur connecté
  //le utilisateur à affiché
  private _tagsPanelOverlayRef: OverlayRef;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  isLoading: boolean = false;    
  
  /**
   * Constructor
   */
  constructor(
      private _changeDetectorRef: ChangeDetectorRef,
      public _dialog:MatDialog,
      private _router: Router,
      private _activatedRoute: ActivatedRoute,
      private _createService:CreateService,
      private formBuilder: FormBuilder,
      private _tableDataService:TableDataService
  )
  {
      
  }
  form: FormGroup;
  _fieldClass = "flex flex-col ";

  

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  onSubmit(){
      if (this.form.valid){
        const formData = this.constructorPayload(this.form.getRawValue())   ;      
        this._createService.create(this.endpoint,formData).subscribe({

          next:(response)=>{
            this.alert={
              type: 'success',
              message:response.message
            };
            this.showAlert = true;
            this._tableDataService.getDatas().pipe().subscribe();
            this.formNgForm.resetForm();

          }, 
          error: (error) => {
            console.error('Error : ', JSON.stringify(error));
            this.form.enable();
            //this.formNgForm.resetForm();
            this.alert = { type: 'error', message: error.error.message??error.message };
            this.showAlert = true;
            this._changeDetectorRef.detectChanges();
        }
      })
    }

  
  }







  setupFormFields(): void {
    this.formFields.forEach(field => {
      const validators = [];
      if (field?.validators?.required) {
        validators.push(Validators.required);
        //validators.push(Validators.pattern("\\S"))
      }
      if (field?.validators?.min) {
        validators.push(Validators.minLength(field.validators.min));
      }
      if (field?.validators?.max) {
        validators.push(Validators.maxLength(field.validators.max));
      }
      if (field?.validators?.email) {
        validators.push(Validators.email);
      }
      if(field?.validators?.regex){
        validators.push(Validators.pattern(field.validators.regex));
      }
      //If it's not provide field is write in create
      if(field?.writeInCreate==undefined || field?.writeInCreate==true){
        this.form.addControl(field.key, this.formBuilder.control('', validators));
      }
      

    });

    console.log("Form====>",this.form)
  }



  /**
   * On init
   */
  ngOnInit(): void
  {

      console.log(this.formFields)
      console.log(this.matDrawer)
      this.matDrawer.open();
      this.form = this.formBuilder.group({});
      this.setupFormFields();

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

      //this.closeDrawer();
      this._changeDetectorRef.markForCheck();

  }

  closeForm(){
    this.matDrawer.close();
    this._router.navigate(['../'], {relativeTo: this._activatedRoute});

  }

  closeAlert() {
    this.showAlert = false; // Définir showAlert à false pour masquer l'alerte lorsque l'utilisateur clique sur la croix
  }

  annuler(): void {
    this.showAlert = false;
    // Re-enable the form
   // this.form.disable();
    // Reset the form
    this.formNgForm.resetForm();
    this._changeDetectorRef.detectChanges();
 }
  

}
