
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDrawer, MatDrawerToggleResult } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { Subject, catchError, debounceTime, distinctUntilChanged, finalize, switchMap, takeUntil } from 'rxjs';
import { FuseAlertType } from '@fuse/components/alert';
import { MatDialog } from '@angular/material/dialog';
import { ValiderRemiseService } from '../valider-remise.service';
import { MatTableDataSource } from '@angular/material/table';
import { TableDataService } from 'app/modules/admin/common/table-data/table-data.services';
import { BigNumber } from 'bignumber.js';
import { Remise } from '../../remise.type';

@Component({
  selector: 'app-details-remise',
  templateUrl: './details-remise.component.html',
  styleUrls: ['./details-remise.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations
})
export class DetailsRemiseComponent implements OnInit {
  @Input() remiseData: any;
  @Input() matDrawer!: MatDrawer;
  @Input() formFields!: any;
  @Input() constructorPayload!: (args: any) => any;
  @Input("formTitle") formTitle: string = "Formulaire Détails/Modification"
  // @Input("endpoint") endpoint: string;
  @ViewChild('formNgForm') formNgForm: NgForm;
  _titulaire  : string = "";
  editMode: boolean = false;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  id: string = "0";
  tableData: any[];
  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private _changeDetectorRef: ChangeDetectorRef,
    private _tableDataService: TableDataService,
    private _validerRemiseService: ValiderRemiseService,
    public _dialog: MatDialog,

  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }
  form: FormGroup;
  _fieldClass = "flex flex-col ";
  showAlert: boolean = false;
  showData: boolean = true;
  data: any


  ngOnInit(): void {
    this.matDrawer.open();
    this.form = this.formBuilder.group({});
    this._activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      if(this.id=="-1"){
        this.closeForm();
        this._changeDetectorRef.detectChanges();

      }
      console.log("id in details", this.id);

    })
    

   
    
    






    //Details service ngOnInit
    this._validerRemiseService.remise$.pipe(takeUntil(this._unsubscribeAll)
    ).subscribe({
      next: (table) => {
        this.tableData = table;

        console.log("table data in details=====>", this.tableData)
      }
    });

  }


  



 /**
  * Permet de recuperer le tire lors 
  * de la correction des champs 
  * compte  
  * code banque
  * code agence 
  */
 

 /**
    * Close the drawer
    */
  closeForm() {
    //Remettre le tableau comme il etait
    this.matDrawer.close();
    this._router.navigate(['../../'], { relativeTo: this._activatedRoute });
  }




  

  onSubmit() {
    if (this.form.valid) {
      //const formData = this.form.getRawValue(); 
      const formData = this.constructorPayload(this.form.getRawValue());


    }


  }

  toggleEditMode(editMode: boolean | null = null): void {
    if (editMode === null) {
      this.editMode = !this.editMode;
    }
    else {
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
    // this.loadData();

    this._changeDetectorRef.detectChanges();
  }

  /**
    * bouton supprimer
    */
  supprimer(): void {
    
  }



  closeAlert() {
    this.showAlert = false; // Définir showAlert à false pour masquer l'alerte lorsque l'utilisateur clique sur la croix
  }


  montantMinimumValidator(control: AbstractControl): { [key: string]: boolean } | null {

    let regMontant = new RegExp('^[0-9]{*}$');

    if (control.value == null || control?.value < 1000) {
      return { "minValue": true }
    }
    return null
  }

}



