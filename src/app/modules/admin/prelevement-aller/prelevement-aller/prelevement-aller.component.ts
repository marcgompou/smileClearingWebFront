import {  ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl,  FormGroup } from '@angular/forms';
import {  PageEvent } from '@angular/material/paginator';
import { Subject} from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { FuseAlertType } from '@fuse/components/alert';
import { PrelevementAllerService } from '../prelevement-aller.service';
import { TableDataService } from '../../common/table-data/table-data.services';



@Component({
  selector: 'app-prelevement-aller',
  templateUrl: './prelevement-aller.component.html',
  styleUrls: ['./prelevement-aller.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations
})




export class PrelevementAllerComponent  implements OnInit, OnDestroy  {

  nomFichierChargerNormal: string | undefined;
  /**Prelevement data */
  headerData:any= {};
  totalData:any={}
  detailsData:any[]=[]
  /**Prelevement data */
  label="Charger fichier prélèvement"  
  //Form
  @ViewChild('fileInput', { static: false }) fileInput: any;


  /**MatTable */
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  /**MatTable */
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  showAlert: boolean = false;

  

  isLoading = false;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  prelevementForm: FormGroup
  nomFichierCharger:string='';
  desactivebouton = true;
  dataStructure = [
    { key: 'codeOperation', label: 'Code Operation' },
    { key: 'codeEnreg', label: 'Code Enreg' },
    { key: 'numLigne', label: 'Num. Ligne' },
    { key: 'dateEcheance', label: 'Date Echeance',type:"date" },
    { key: 'banque', label: 'Banque' },
    { key: 'guichet', label: 'Guichet' },
    { key: 'compteDebite', label: 'Compte Débité' },
    { key: 'nomDebit', label: 'Nom Débit' },
    { key: 'nomBanque', label: 'Nom Banque' },
    { key: 'libelleOperat', label: 'Libellé Opérat' },
    { key: 'montant', label: 'Montant','type':'montant' }
  ];

  
  displayedColumns: string[] = ['codeOperation', 'codeEnreg', 'numLigne', 'dateEcheance', 'banque', 'guichet', 'compteDebite', 'nomDebit', 'nomBanque', 'libelleOperat', 'montant'];
  totalRows: number=0;
  nombreprelevement: number;
  
  

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _formBuilder: UntypedFormBuilder,
    private _prelevementAllerService: PrelevementAllerService,
    private _tableDataService: TableDataService
    ) {
      this.prelevementForm = this._formBuilder.group({
        fichierPrelevement: [''], // 
      });
  }




  

  //CYCLE DE VIE
  ngOnInit() {
    this._tableDataService.setDatas$([]);
    this.prelevementForm.get('fichierPrelevement')?.setValue(this.label);

  }


  

  // closeAlert() {
  //   this.showAlert = false; // Définir showAlert à false pour masquer l'alerte lorsque l'utilisateur clique sur la croix
  // }


  onSubmit() { 
    this.showAlert = false;
    this.isLoading = true;
    let data={
      prelevementEntete: this.headerData,
      prelevementDetails: this.detailsData,
      prelevementTotal: this.totalData
    }

  
   this._prelevementAllerService.createPrelevement(data).subscribe({
      next: (data) => {
        this.clearFile();
        this.alert = { type: 'success', message: 'Enregistrement effectué avec succès' };
        this.showAlert = true;
        this._changeDetectorRef.detectChanges();

      },
      error: (error) => {
        // Affichage d'un message d'erreur
        console.error('Error : ', JSON.stringify(error));
        this.alert = { type: 'error', message: error.error.message ?? error.message };
        this.showAlert = true;
        this.isLoading = false;
       
        this._changeDetectorRef.detectChanges();
      }
    });
  }
  

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }


  clearFile(){
    this._tableDataService.setDatas$([]);
    this.prelevementForm.get('fichierPrelevement')?.setValue(this.label);
    this.headerData={}
    this.totalData={}
    this.totalRows = 0;
    this.desactivebouton = true;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = null;
    }
    
    this._changeDetectorRef.detectChanges();
  }

  onFileSelected(event: any) {
    try{
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        this.detailsData=[];
        const fileNameWithExtension = selectedFile.name;
        const fileNameWithoutExtension:string = fileNameWithExtension.split('.').slice(0, -1).join('.')??"";
        this.nomFichierCharger = fileNameWithoutExtension;
    
        this.prelevementForm.get('fichierPrelevement')?.setValue(fileNameWithoutExtension);
        // Now, you can read the file content or perform other operations with it.
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
          const fileContent = e.target.result as string;
          const lines = fileContent.split('\n'); // Split the content into lines
          const totalLines = lines.length;
          for (let i = 0; i < totalLines; i++) {
            const line = lines[i];
            // CALL FUNCTION TO RETRIEVE THE HEADER //031
            if (line.substring(0, 2).trim()==="031") {
              this.extractHeaderValues(line);
            }
            // DETAILS //032
            if(line.substring(0, 2).trim()==="032"){
              this.detailsData.push(this.extractDetails(line));
            }
            // CALL FUNCTION TO RETRIEVE THE LAST LINE //039
            if (line.substring(0, 2).trim()==="039") {
              this.extractTotalData(line);
            }
          }
          if(this.detailsData.length>0){
            this._tableDataService.setDatas$( this.detailsData)
            this.totalRows=this.detailsData.length;
          }
          this._changeDetectorRef.markForCheck();
        };
        fileReader.readAsText(selectedFile, 'ISO-8859-1');
      } else {
        console.error("No file selected.");
      }
    }catch(error){
      console.log(error)
      this.alert = { type: 'error', message: error.error.message ?? error.message };
      this.showAlert = true;
    }finally{
      this._tableDataService.setDatas$([])
      this.isLoading = false;
      this._changeDetectorRef.detectChanges();
    }
  }


   convertDateToDateTime(dateStr: string): string  {
    
    if (dateStr.length !== 6) {
      // Vérifier la longueur de la chaîne d'entrée
      console.error("La chaîne de date doit avoir une longueur de 6 caractères.");
   
        // Affichage d'un message d'erreur
      //  console.error('Error : ', JSON.stringify(error));
        this.alert = { type: 'error', message:  "La chaîne de date opération doit avoir une longueur de 6 caractères." };
        this.showAlert = true;
        this.desactivebouton = false;
        this.isLoading = false;
        this._changeDetectorRef.detectChanges();
      

      return "";
    }
  
    try {
      const  day = parseInt(dateStr.substring(0, 2)) ;
      const month = parseInt(dateStr.substring(2, 4)) - 1;
      const year = parseInt(dateStr.substring(4, 6)) + 2000;
  
      if (isNaN(year) || isNaN(month) || isNaN(day)) {
        return "";
      }
  
      const dateEmission = new Date(year, month, day);
      return dateEmission.toISOString().substring(0, 10);
    } catch (error) {
      console.error("Erreur lors de la conversion de la date : " + error.message);
      return "";
    }
  }
 // const dateEmission = convertDateToDateTime(dateStr);
  extractHeaderValues(headerLine: string) {
    console.log("headerLine",headerLine);
    const compteCrediteRaw = headerLine.substring(22, 33).trim();
    const compteCredite = compteCrediteRaw[0] === '0' ? compteCrediteRaw.substring(1) : compteCrediteRaw;
    const dateOperStartIndex = compteCrediteRaw[0] === '0' ? 64 : 63;
    this.headerData = {
      nomFichier : this.nomFichierCharger ,
      nomFichierGenerer : "nomParDefaut",
      codeOperation: headerLine.substring(0, 2).trim(),
      codeEnreg: headerLine.substring(2, 3).trim(),
      numLigne: parseInt(headerLine.substring(3, 8).trim(), 10),
      dateEmission: this.convertDateToDateTime(headerLine.substring(8, 14).trim()),
      banque: headerLine.substring(14, 17).trim(),
      guichet: headerLine.substring(17, 22).trim(),
      compteCredite: compteCredite,
      nom: headerLine.substring(33, 57).trim(),
      codeEmeteur: headerLine.substring(57, 62).trim(),
      codeEmeteurSuite: headerLine.substring(62, 63),
      //dateOper:  this.convertDateToDateTime(headerLine.substring(63, 69).trim()),
      dateOper: this.convertDateToDateTime(headerLine.substring(dateOperStartIndex, dateOperStartIndex + 6).trim()),
      zoneVide: "zoneVide",
      
    };
  
  }

  extractTotalData(data: string) {
    const codeOperation = data.substring(0, 2).trim();
    const codeEnreg = data.substring(2, 3).trim();
    const numLigne = data.substring(3, 8).trim() || null;
    const dateEmission =  this.convertDateToDateTime(data.substring(8, 14).trim()) || null;
    const zoneVide1 = data.substring(14, 22).trim();
    const compte = data.substring(22, 33).trim() || null;
    const zoneVide2 = data.substring(33, 108).trim();
    const montant =data.substring(104, 116).trim() || null;
    const zoneVide3 = data.substring(116, 128).trim();
    //this.nombreprelevement=data.length;
    this.totalData= {
        codeOperation,
        codeEnreg,
        numLigne,
        dateEmission,
        zoneVide1,
        compte,
        zoneVide2,
        montant,
        zoneVide3,
    };

  }

  extractDetails(data: string) :{codeOperation,
      codeEnreg,numLigne,dateEcheance,
      banque,guichet,compteDebite,
      nomDebit,nomBanque,libelleOperat,
      montant,zoneVide,
  }{
        const codeOperation = data.substring(0, 2).trim();
        const codeEnreg = data.substring(2, 3).trim();
        const numLigne = parseInt(data.substring(3, 8).trim()) || null;
        const dateEcheance = this.convertDateToDateTime(data.substring(8, 14).trim()) || null;
        const banque = data.substring(14, 17).trim();
        const guichet = data.substring(17, 22).trim();
        const compteDebite = data.substring(22, 33).trim();
        const nomDebit = data.substring(33, 57).trim();
        const nomBanque = data.substring(57, 74).trim() || null;
        const libelleOperat = data.substring(74, 104).trim();
        const montant = parseFloat(data.substring(104, 116).trim()) || null;
        const zoneVide = "zoneVide";
        return  {
            codeOperation,
            codeEnreg,
            numLigne,
            dateEcheance,
            banque,
            guichet,
            compteDebite,
            nomDebit,
            nomBanque,
            libelleOperat,
            montant,
            zoneVide,
        };
  }







}
