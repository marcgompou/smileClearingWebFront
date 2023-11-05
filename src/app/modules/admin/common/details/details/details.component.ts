import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDrawer, MatDrawerToggleResult } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { DetailsService } from '../details.service';
import { Subject,takeUntil } from 'rxjs';
import { FuseAlertType } from '@fuse/components/alert';
import { TableDataService } from '../../table-data/table-data.services';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations     : fuseAnimations,
})
export class DetailsComponent implements OnInit,OnChanges {

  @Input() matDrawer!:MatDrawer;
  @Input() formFields!:any;

  @Input() loadDataOnInit:boolean=true;
  @Input() canDelete:boolean=true;
  @Input() staticDatas:{libelle:any,value:any}[]=[];


  @Input() constructorPayload!:(args: any) => any;
  @Input("formTitle") formTitle:string ="Formulaire Détails/Modification"
  @Input("endpoint") endpoint:string ;
  @ViewChild('formNgForm') formNgForm: NgForm;
  editMode: boolean = false;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  id: string="0";
  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private _changeDetectorRef: ChangeDetectorRef,
    private _detaisService:DetailsService,
    private _tableDataService:TableDataService,
    public _dialog:MatDialog,
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }
  form: FormGroup;
  _fieldClass = "flex flex-col ";
  showAlert: boolean = false;
  showData:boolean=true;
  data:any


  ngOnInit(): void {
    this.matDrawer.open();
    if(this.loadDataOnInit){

      this.loadData();

    }else{
      this.setupFormFields();

    }
    this._activatedRoute.params.subscribe(params=>{
      this.id = params['id'];
      console.log("id in details",this.id);
    })
  
  }

  //Close the form and go back
  closeForm(){
    this.matDrawer.close();
    this._router.navigate(['../../'], {relativeTo: this._activatedRoute});
  }

  
  /**
    * Close the drawer
    */
  closeDrawer(): Promise<MatDrawerToggleResult> {
    return this.matDrawer.close();
  }

  setupFormFields(): void {

    try{
        console.log("======>details form fields",this.formFields);
        this.formFields.forEach(field => {
          const validators = [];
          if (field?.validators?.required) {
            validators.push(Validators.required);
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
          if (field?.validators?.minValue) {
            validators.push(Validators.min(field.validators.minValue));
          }
          if(field?.validators?.regex){
            validators.push(Validators.pattern(field.validators.regex));
          }
          //POUR POUVOIR PRENDRE DES TABLEAUX 
          //DANS LE FORMULAIRE CAS MULTIPLE SELECT
          let fieldValue:any="";

          
          if(this.data){   
            console.log("====details-data===>",this.data);     
            console.log("====details-data-key===>",field.key);       
              if(this.data[field.key]!==null && this.data[field.key]!==undefined ){
                fieldValue=this.data[field.key];
                console.log("====details-data-key===>",fieldValue);
              }
          }
          if(!this.form){
            this.form = this.formBuilder.group({});
          }
          this.form.addControl(field.key, this.formBuilder.control(fieldValue, validators));
          if(field?.disabled){
            this.form.get(field.key).disable();
          }
        });
      

      console.log("Form====>",this.form)
      }
      catch(error){

        console.log(error)
        this.closeForm()
      }
  }

  onSubmit(){
    if (this.form.valid){
      //const formData = this.form.getRawValue(); 
      const formData = this.constructorPayload(this.form.getRawValue())   ;      
      
      this._detaisService.update(this.id,this.endpoint,formData).subscribe({

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
          this.formNgForm.resetForm();
          this.alert = { type: 'error', message: error.error.message??error.message };
          this.showAlert = true;
          this._changeDetectorRef.detectChanges();
      }
    })
  }


}

toggleEditMode(editMode: boolean | null = null): void
    {
        if ( editMode === null )
        {
            this.editMode = !this.editMode;
        }
        else
        {
            this.editMode = editMode;
        }

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }
 /**
   * bouton annuler
   */
    annuler(): void {
      this.showAlert = false;
      // Re-enable the form
     // this.form.disable();
      // Reset the form
      this.loadData();
     
      this._changeDetectorRef.detectChanges();
  }

 /**
   * bouton supprimer
   */
  supprimer(): void {
    const deleteObjectDialog = this._dialog.open(
        DeleteConfirmationComponent,
        {
          data:  { 
              id:this.id,
              endpoint:this.endpoint
            }
        }

    );
    deleteObjectDialog.afterClosed().subscribe({

        next:(response)=>{

          console.log("delete response=====>",response)
          if(response?.isDeleted){
              this._tableDataService.getDatas().pipe().subscribe();
              this._router.navigate(['../../'], { relativeTo: this._activatedRoute });
              
              this.matDrawer.close();
             
          }
         // this._detaisService.refreshTable(this.endpoint);
          this._changeDetectorRef.markForCheck();
        },
        
        error: (error) => {
          console.error('Error : ', JSON.stringify(error));
          this.alert = { type: 'error', message: error.error.message??error.message };
          this.showAlert = true;
          this._changeDetectorRef.detectChanges();
      }
    });
}
  
  



  closeAlert() {
    this.showAlert = false; // Définir showAlert à false pour masquer l'alerte lorsque l'utilisateur clique sur la croix
  }


 
  /**
   * Récuperer les données du tableau  de l'objet
   */
  loadData():void{
    // Hide the alert
    //      this.endpoint,this.filterObject,this.paginationObject
    this._detaisService.data$.pipe(takeUntil(this._unsubscribeAll)
    ).subscribe({
        next: (response:any) => {
          console.log("Response=> :", response);
          // this.dataSource = new MatTableDataSource(response.data);
          
          if(response==null){
            
            this.closeForm()

          }else{
            this.data=response.data;
            this.form = this.formBuilder.group({});
            this.setupFormFields();
          }
          //A supprimer apres integration

          this._changeDetectorRef.markForCheck();
        }, 
        error: (error) => {
          //not show historique
          this.showData = false;
          console.error('Error : ',JSON.stringify(error));
          // Set the alert
          this.alert = { type: 'error', message: error.error.message??error.error };
          // Show the alert
          this.showAlert = true;
          
          this._changeDetectorRef.markForCheck();
        }
    });
  }
}
