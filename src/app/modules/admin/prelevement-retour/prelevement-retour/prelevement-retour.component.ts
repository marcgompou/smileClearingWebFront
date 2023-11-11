import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, FormGroup,  } from '@angular/forms';

import { Subject} from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { PrelevementRetourService } from '../prelevement-retour.service';
import { TableDataService } from '../../common/table-data/table-data.services';



@Component({
  selector: 'app-prelevement-retour',
  templateUrl: './prelevement-retour.component.html',
  styleUrls: ['./prelevement-retour.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations
})




export class PrelevementRetourComponent implements OnInit, OnDestroy {
  drawerMode: 'side' | 'over';

  nomFichierCharger: string | undefined="";
  nomFichierChargerNormal: string | undefined;
  
  /**Prelevement data */
  headerData:any= {};
  totalData:any={}
  detailsData:any[]=[]
  totalRows = 0;

  /**Prelevement data */

  /**form data*/
  
  @ViewChild('fileInput', { static: false }) fileInput: any;

  /**form data*/
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  showAlert: boolean = false;

  

  isLoading = false;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  prelevementForm : FormGroup;

  dataStructure = [

    { key: 'numLigne', label: 'Num. Ligne' },
    { key: 'dateEcheance', label: 'Date Echeance' },
    { key: 'banque', label: 'Banque' },
    { key: 'guichet', label: 'Guichet' },
    { key: 'compteDebite', label: 'Compte Débité' },
    { key: 'nomDebit', label: 'Nom Débit' },
    { key: 'nomBanque', label: 'Nom Banque' },
    { key: 'libelleOperat', label: 'Libellé Opération' },
    { 
      key: 'statut', 
      type:'status',
      label: 'Etat prelev.', 
      "statusValues":[
        { value: 0, libelle: "Payé", color: "#68D391" }, // Green
        { value: 1, libelle: "Debit. interdit", color: "#FF5733" }, // Orange
        { value: 4, libelle: "Cpte. fermé", color: "#808080" }, // Gray
        { value: 5, libelle: "Cpte. inexistant", color: "#FFD700" }, // Yellow
        { value: 6, libelle: "Rejetée", color: "#F56565" } // Red
      ]
    },
    { key: 'montant', label: 'Montant' }
  ];
  
  displayedColumns: string[] = ['numLigne', 'dateEcheance', 'banque', 'guichet', 'compteDebite', 'nomDebit', 'nomBanque', 'libelleOperat', 'montant','statut'];
  

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _formBuilder: UntypedFormBuilder,
    private _prelevementRetourService: PrelevementRetourService,
    private _tableDataService: TableDataService) {
      this.prelevementForm = this._formBuilder.group({
        fichierPrelevement: [''], // This is the FormControl
        // Add other form controls here
      });
  }


  //CYCLE DE VIE
  ngOnInit() {
    this._tableDataService.setDatas$([])
  }

  closeAlert() {
    this.showAlert = false; // Définir showAlert à false pour masquer l'alerte lorsque l'utilisateur clique sur la croix
  }

  onSubmit() { 

    let data={
      prelevementEntete: this.headerData,
      prelevementDetails: this.detailsData,
      prelevementTotal: this.totalData
    }

    this._prelevementRetourService.chargerRetourPrelevement(data).subscribe({
      next: (data) => {
        this.isLoading = true;
        // Réinitialisation des données du formulaire et de la table
        this._tableDataService.setDatas$( [])
        this.headerData.nom = "";
        this.totalData.montant = "0";
        this._changeDetectorRef.detectChanges();
        this.alert = { type: 'success', message: 'Enregistrement effectué avec succès' };
        this.showAlert = true;
        this.isLoading = false;
        this.detailsData=[];
        this._changeDetectorRef.detectChanges();

        // Affichage d'un message de succès
        // Vous pouvez ajouter ici un message de succès si nécessaire
      },
      error: (error) => {
        this.detailsData=[]
        // Affichage d'un message d'erreur
        console.error('Error : ', JSON.stringify(error));
        this.alert = { type: 'error', message: error.error.message ?? error.message };
        this.showAlert = true;
        this._changeDetectorRef.detectChanges();
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

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  clearFile(){
    this._tableDataService.setDatas$([])
    this.prelevementForm.get('fichierPrelevement')?.setValue("");
    this.headerData={}
    this.totalData={}
    this.totalRows = 0;
    
    if (this.fileInput) {
      this.fileInput.nativeElement.value = null; // Clear the input value
    }
    

    this._changeDetectorRef.detectChanges();
  }

  onFileSelected(event: any) {
    try{
      this.isLoading = true;
      this.detailsData=[];
          const selectedFile = event.target.files[0];
          console.log('Nom du fichier sélectionné :', this.nomFichierCharger);

          if (selectedFile) {
            const selectedFile = event.target.files[0];
        
            const fileNameWithExtension = selectedFile.name;
            const fileNameWithoutExtension = fileNameWithExtension.split('.').slice(0, -1).join('.');
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
                // CALL FUNCTION TO RETRIEVE THE HEADER
                if (i === 0) {
                  this.extractHeaderValues(line);
                }
                //Details
                if(i>0 && i<totalLines-2){
                    this.detailsData.push(this.extractDetails(line));
                }
                // CALL FUNCTION TO RETRIEVE THE LAST LINE 
                if (i === totalLines-2) {
                  this.extractTotalData(line);
                }
              }
              if(this.detailsData.length>0){
                
                //Envoie des données dans table data
                this._tableDataService.setDatas$( this.detailsData)
                this.totalRows=this.detailsData.length;
              }
              this._changeDetectorRef.markForCheck();
              //console.log('File Content:', fileContent);
            };
            fileReader.readAsText(selectedFile, 'ISO-8859-1');
            
          } else {
            console.error("No file selected.");
          }
          this._changeDetectorRef.detectChanges();
          this.isLoading = false;
      }catch(e){
        console.log(e)
        this._tableDataService.setDatas$( [])
        this._changeDetectorRef.detectChanges();
      }
  }

  getColumnHeaderText(column: string): string {
    //  console.log("column===>",column)
    let found = this.dataStructure.find(e => e.key == column);
    return found ? found.label : "";

  }


   convertDateToDateTime(dateStr: string): string  {
    if (dateStr.length !== 6) {
      // Vérifier la longueur de la chaîne d'entrée
      console.error("La chaîne de date doit avoir une longueur de 6 caractères.");
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
    try{
      this.headerData = {
        nomFichier : this.nomFichierCharger ,
        nomFichierGenerer : "nomParDefaut",
        codeOperation: headerLine.substring(0, 2).trim(),
        codeEnreg: headerLine.substring(2, 3).trim(),
        numLigne: parseInt(headerLine.substring(3, 8).trim(), 10),
        dateEmission: this.convertDateToDateTime(headerLine.substring(8, 14).trim()),
        banque: headerLine.substring(14, 17).trim(),
        guichet: headerLine.substring(17, 22).trim(),
        compteCredite: headerLine.substring(22, 33).trim(),
        nom: headerLine.substring(33, 57).trim(),
        codeEmeteur: headerLine.substring(57, 62).trim(),
        dateOper:  this.convertDateToDateTime(headerLine.substring(63, 69).trim()),
        zoneVide: "zoneVide",
        
      };
    }
     catch(e){
      console.log("extractHeaderValues=eeee==>",e.message);
        this.headerData= {
          nomFichier : "-" ,
          nomFichierGenerer : "-",
          codeOperation: "-",
          codeEnreg: "-",
          numLigne:"-",
          dateEmission: "-",
          banque: "-",
          guichet:"-",
          compteCredite: "-",
          nom: "-",
          codeEmeteur: "-",
          dateOper:  "-",
          zoneVide: "-",
        }
        throw new Error(e);  
      }
      
  
  }

  extractTotalData(data: string) {
    try{
      const codeOperation = data.substring(0, 2).trim();
      const codeEnreg = data.substring(2, 3).trim();
      const numLigne = data.substring(3, 8).trim() || null;
      const dateEmission =  this.convertDateToDateTime(data.substring(8, 14).trim()) || null;
      const zoneVide1 = data.substring(14, 22).trim();
      const compte = data.substring(22, 33).trim() || null;
      const zoneVide2 = data.substring(33, 108).trim();
      const montant =data.substring(104, 116).trim() || null;
      const zoneVide3 = data.substring(116, 128).trim();
  
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
    catch(e){
      console.log("extractTotalData=eeee==>",e.message);
      this.totalData= {
        codeOperation:"",
        codeEnreg:"",
        numLigne:"",
        dateEmission:"",
        zoneVide1:"",
        compte:"",
        zoneVide2:"",
        montant:"",
        zoneVide3:"",
      };  
      throw new Error(e);  
    }

  }


  extractDetails(data: string) {
    try {
      // Extraction des données
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
      const montant = parseInt(data.substring(104, 116).trim()) || null;
      const statut = parseInt(data.substring(117, 119).trim()) ?? 8;
  
      console.log("statut=============>", statut);
  
      // Création de l'objet résultant
      const result = {
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
        zoneVide: "zoneVide",
        statut,
      };
  
      return result;
    } catch (e) {
      // En cas d'erreur, renvoyer un objet vide avec des valeurs par défaut
      console.log("extractDetails=eeee==>", e.message);
      return {
        codeOperation: "",
        codeEnreg: "",
        numLigne: "",
        dateEcheance: "",
        banque: "",
        guichet: "",
        compteDebite: "",
        nomDebit: "",
        nomBanque: "",
        libelleOperat: "",
        montant: "",
        zoneVide: "",
        statut: "",
      };
    }
  }
}