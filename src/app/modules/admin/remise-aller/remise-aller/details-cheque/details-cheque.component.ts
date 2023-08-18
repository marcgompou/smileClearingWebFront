
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDrawer, MatDrawerToggleResult } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { Subject, catchError, debounceTime, distinctUntilChanged, finalize, switchMap, takeUntil } from 'rxjs';
import { FuseAlertType } from '@fuse/components/alert';
import { MatDialog } from '@angular/material/dialog';
import { CreerRemiseService } from '../remise.service';
import { MatTableDataSource } from '@angular/material/table';
import { TableDataService } from 'app/modules/admin/common/table-data/table-data.services';
import { BigNumber } from 'bignumber.js';
import { img } from '../creer-remise/image';
import { Cheque } from '../../cheque.type';

@Component({
  selector: 'app-details-cheque',
  templateUrl: './details-cheque.component.html',
  styleUrls: ['./details-cheque.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations
})
export class DetailsChequeComponent implements OnInit {
  @Input() chequeData: any;
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
    private _remiseService: CreerRemiseService,
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
    this.setupFormFields();

    



    this._activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      if(this.id=="-1"){
        this.closeForm();
        this._changeDetectorRef.detectChanges();

      }
      console.log("id in details", this.id);

    })
    

    this.getTitulaire(this.chequeData)

   


    this.setupFieldListeners();
    
    






    //Details service ngOnInit
    this._remiseService.remise$.pipe(takeUntil(this._unsubscribeAll)
    ).subscribe({
      next: (table) => {
        this.tableData = table;

        console.log("table data in details=====>", this.tableData)
      }
    });

  }


  getTitulaire(chequeData:any){
    this._remiseService.getTire(chequeData).subscribe({
      next: (response: any) => {
        console.log("Response===> titulaire ====> :", response);
        this._titulaire = response.data.titulaire;
        console.log("titulaire=====>",this._titulaire)
        if( this.form.get('tire')){
          this.form.patchValue({
            tire:response.data.titulaire
          });
          this.form.get('tire').disable();

        }
        
        if( this.form.get('titulaire')){
          this.form.patchValue({
            tire:response.data.titulaire
          });
          this.form.get('titulaire').disable();

        }
        this._changeDetectorRef.detectChanges();
  
      },
      error: (error) => {
        this._titulaire ="";
        console.error('Error : ', error);
        this.form.patchValue({
          tire:""
        });
        this.form.get('tire').enable();
        this._changeDetectorRef.detectChanges();
      },
    });
  }



 /**
  * Permet de recuperer le tire lors 
  * de la correction des champs 
  * compte  
  * code banque
  * code agence 
  */
  setupFieldListeners() {

    let chequeData={
      codeBanque:this.form.value.codeBanque,
      codeAgence:this.form.value.codeAgence,
      compte:this.form.value?.compte
    }

    console.log("chequeData------->",chequeData);

    this.form.get('codeBanque').valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
        console.log('codeBanque',value);
        chequeData.codeBanque=value;
        this.getTitulaire(chequeData);    
      });


    if(this.form.get('codeAgence')){
        this.form.get('codeAgence').valueChanges.subscribe(value => {
            console.log('codeAgence',value)
            chequeData.codeAgence=value;
            this.getTitulaire(chequeData);
        });
    }
    if(this.form.get('compte')){

      this.form.get('compte').valueChanges.subscribe(value => {
        console.log('compte',value)
        chequeData.compte=value;
        this.getTitulaire(chequeData);
      });
    }


  }

 /**
    * Close the drawer
    */
  closeForm() {
    //Remettre le tableau comme il etait
    this.matDrawer.close();
    this._router.navigate(['../../'], { relativeTo: this._activatedRoute });
  }




  setupFormFields(): void {

    
    console.log("======>details form fields", this.formFields);
    this.formFields.forEach(field => {
      
      const validators = [];
      if (field?.validators?.required) {
        validators.push(Validators.required);
        //validators.push(Validators.pattern("\\S"))
      }
      if (field?.validators?.min) {
        validators.push(Validators.minLength(field?.validators?.min));
      }
      if (field?.validators?.max) {
        validators.push(Validators.maxLength(field?.validators?.max));
      }
      if (field?.validators?.email) {
        validators.push(Validators.email);
      }
      if (field?.validators?.regex) {
        validators.push(Validators.pattern(field?.validators?.regex));
      }
      let fieldValue = "";
      if (this.chequeData[field.key] !== null && this.chequeData[field.key] !== undefined) {
        fieldValue = this.chequeData[field.key];
      }
      if (field.validators.minValue) {
        validators.push(this.montantMinimumValidator);
      }
      if(field.key!=="default") {
        this.form.addControl(field.key, this.formBuilder.control(fieldValue, validators));
      }
    });

    


    // this._changeDetectorRef.markForCheck();
    console.log("Form====>", this.form)
    console.log("this.chequeData====>", this.chequeData)
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



  
  //Verifie si le cheque existe deja
  chequeExist(cheques:Cheque[],cheque:any,indexCheque:number): boolean {
    const seen = new Map<string, Cheque>();
    let find:boolean=false;
    const key = `${cheque.numChq}-${cheque.codeBanque}-${cheque.codeAgence}-${cheque.compte}`;
    
    //Ajout de l'element dans le set
    seen.set(key, cheque);
    //Recherche de l'element dans le tableau
    let index=0;

    for (const item of cheques) {
      const itemKey=`${item.numChq}-${item.codeBanque}-${item.codeAgence}-${item.compte}`
      if (seen.has(itemKey) && indexCheque!=index) {
        
        let messageDuplicate="Chèque existant, prière de supprimmer la seconde occurence avant modification";
        this.alert = { type: 'error', message: messageDuplicate};
        // Show the alert
        this.showAlert = true;
        this._changeDetectorRef.markForCheck();
        find=true;
        break;
      }
      index++;

    }
    return find;
  }

  




  updateCheque(): void {
    
    if (this.form.valid) {


      let formData:any = this.form.getRawValue();
      formData.codeBanqueIsCorrect = true;
      formData.codeAgenceIsCorrect = true;
      formData.compteIsCorrect = true;
      formData.cleRibIsCorrect = true;
      formData.numChequeIsCorrect = true;
      formData.chequeIsCorrect=true;




      //Si le cheque existe déja on affiche un message d'erreur et la modification est interrompue
      if(!this.chequeExist(this.tableData,formData,parseInt(this.id))){
        if (!this.calculcleRibIsNotCorrect(formData)) {

          //Mise à jour du tableau tout en conservant l'image 
          this.tableData[this.id] ={...this.tableData[this.id], ...formData};
          
          this._remiseService.updateDataTable(this.tableData);

          this.closeForm()
        }
        else {
          this.alert = {
            type: 'error', message: "Clé RIB incorrect , veuiller verifier les informations du formulaire"
          }
          this.showAlert = true;
          this._changeDetectorRef.detectChanges();
        }
      }

    }

  }


  

  closeAlert() {
    this.showAlert = false; // Définir showAlert à false pour masquer l'alerte lorsque l'utilisateur clique sur la croix
  }

  calculcleRibIsNotCorrect(chequeDto: any): boolean {
    try {
      console.log("******chequeDto*******", chequeDto);
      const Codebanque: string | null = chequeDto.codeBanque;
      const Agence: string | null = chequeDto.codeAgence;
      const NumCompte: string | null = chequeDto.compte;
      const cleRib: string | null = chequeDto.cleRib;

      const ConvertCodeBanque: string | null = this.convertCodePaysToNumPays(Codebanque);
      const numCpt: string = ConvertCodeBanque + Agence + NumCompte + "00";

      console.log("******Codebanque*******", Codebanque);
      console.log("******Agence*******", Agence);
      console.log("******NumCompte*******", NumCompte);
      console.log("******cleRib*******", cleRib);
      console.log("******ConvertCodeBanque*******", ConvertCodeBanque);
      console.log("******numCpt*******", numCpt);

      const bigNumCpt: BigNumber = new BigNumber(numCpt);
      const bigCleRib: BigNumber = new BigNumber(cleRib);
      const num97: BigNumber = new BigNumber(97);

      const mod: BigNumber = bigNumCpt.mod(num97);


      const calculCleRib: BigNumber = num97.minus(mod);
      console.log(calculCleRib.toString());
      console.log("******bigNumCpt*******", bigNumCpt);
      console.log("******bigCleRib*******", bigCleRib);
      console.log("******num97*******", num97);
      console.log("******mod*******", mod);
      console.log("******calculCleRib*******", calculCleRib);

      // return true if calculated rib is not correct else false
      return !calculCleRib.isEqualTo(bigCleRib);
    } catch (error) {
      this.alert = {
      
        type: 'error', message: "Clé RIB incorrect , veuiller verifier les informations du formulaire"
      }
      this.showAlert = true;
      this._changeDetectorRef.detectChanges();
      return true;
    }
  }

  montantMinimumValidator(control: AbstractControl): { [key: string]: boolean } | null {

    let regMontant = new RegExp('^[0-9]{*}$');

    if (control.value == null || control?.value < 1000) {
      return { "minValue": true }
    }
    return null
  }
  convertCodePaysToNumPays(codeBanque: string): string {
    const arrayPaysCodeAlpha: string[] = ["BJ", "BF", "CI", "GW", "NE", "ML", "SN", "TG"];
    const arrayPaysCodeNum: string[] = ["21", "26", "39", "76", "55", "43", "25", "37"];

    const numCodeBanque: string = codeBanque.substring(0, 2);
    const index: number = arrayPaysCodeAlpha.indexOf(numCodeBanque);
    console.log("******numCodeBanque*******", numCodeBanque);
    console.log("******index*******", index);
    console.log("******codeBanque*******", codeBanque);
    console.log("******codeBanque SUBSTRING*******", codeBanque.substring(2));
    if (index !== -1) {
      codeBanque = arrayPaysCodeNum[index] + codeBanque.substring(2);

    } else {
      throw new Error("Erreur sur le code Banque");
    }

    return codeBanque;
  }



  // getTitulaire(): void {
  //   // Hide the alert
  //   //      this.endpoint,this.filterObject,this.paginationObject
  //   this._remiseService.titulaire$.pipe(takeUntil(this._unsubscribeAll)
  //   ).subscribe({
  //     next: (response: any) => {
  //       console.log("Response===> :", response);
  //       // this.dataSource = new MatTableDataSource(response.data);

        
  //         this._titulaire = response.data.titulaire;
  //         // this.form = this.formBuilder.group({});
  //         // this.setupFormFields();
        
  //       //A supprimer apres integration

  //       this._changeDetectorRef.markForCheck();
  //     },
  //     error: (error) => {
     
  //       console.error('Error : ', JSON.stringify(error));
     
  //     }
  //   });
  // }
}



