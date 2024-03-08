import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import * as XLSX from "xlsx";
import {
  UntypedFormBuilder,
  UntypedFormControl,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { BehaviorSubject, Subject, takeUntil, timeout } from "rxjs";
import { fuseAnimations } from "@fuse/animations";
import { MatTableDataSource } from "@angular/material/table";
import { FuseAlertType } from "@fuse/components/alert";
import { SalaireAllerService } from "../salaire-aller.service";
import { TableDataService } from "../../common/table-data/table-data.services";
import { CompteEntreprises } from "../salaire-aller.type";

@Component({
  selector: "app-salaire-aller",
  templateUrl: "./salaire-aller.component.html",
  styleUrls: ["./salaire-aller.component.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations,
})
export class SalaireAllerComponent implements OnInit, OnDestroy {
  nomFichierChargerNormal: string | undefined;
  /**Salaire data */
  headerData: any = {};
  totalData: any = {};
  detailsData: any[] = [];
  listeCompteEntreprise: any[] = [];
  /**Salaire data */
  label = "Charger fichier salaire";
  //Form
  @ViewChild("fileInput", { static: false }) fileInput: any;
  fileExtension:string=""
 
  alert: { type: FuseAlertType; message: string } = {
    type: "success",
    message: "",
  };
  showAlert: boolean = false;

  isLoading = false;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  salaireForm: FormGroup 
  nomFichierCharger: string = "";
  codeEnreg;
  nom;
  domici;
  guichet;
  compte;
  montant;
  libelle;
  banque;

  dataStructureTxt: any[] = [
    { key: "codeEnreg", label: "Code Enreg" },
    { key: "nom", label: "Béneficiaire" },
    { key: "domici", label: "Domiciliation" },
    { key: "banque", label: "Banque" },
    { key: "guichet", label: "Guichet" },
    { key: "compte", label: "Compte Débité" },
    { key: "montant", label: "Montant", type: "montant" },
    { key: "libelle", label: "Libellé Opérat" },

  ];
  

  displayedColumnsTxt: string[] =this.dataStructureTxt.map((o) => o.key);

  dataStructureXls:any[] = [
    { key: "nom", label: "Béneficiaire" },
    { key: "banque", label: "Banque" },
    { key: "guichet", label: "Guichet" },
    { key: "compte", label: "Compte Débité" },
    { key: "montant", label: "Montant", type: "montant" },
    { key: "libelle", label: "Libellé Opérat" },
    { key: "cleRib", label: "Cle Rib" },

  ];
  
  displayedColumnsXls: string[] =this.dataStructureXls.map((o) => o.key);
  
  totalRows: number = 0;
  nombreSalaire: number;
  hasError = false;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _formBuilder: UntypedFormBuilder,
    private _salaireAllerService: SalaireAllerService,
    private _tableDataService: TableDataService,
   // private _compteEntreprises: BehaviorSubject<CompteEntreprises[] | null> = new BehaviorSubject(null);

  ) {
    this.salaireForm = this._formBuilder.group({
      fichierSalaire: [""], //
      idCompteClient: ["", Validators.required],
    });
  }

  //CYCLE DE VIE
  ngOnInit() {
    this._tableDataService.setDatas$([]);
    this.salaireForm.get("fichierSalaire")?.setValue(this.label);
    this.loadCompte();
  }

  // closeAlert() {
  //   this.showAlert = false; // Définir showAlert à false pour masquer l'alerte lorsque l'utilisateur clique sur la croix
  // }
  
  
  onSubmit() {
    this.showAlert = false;
    this.isLoading = true;
    let data = {
      salaireEntete: this.headerData,
      salaireDetails: this.detailsData,
      salaireTotal: this.totalData,
    };

    this._salaireAllerService.createSalaire(data).subscribe({
      next: (data) => {
        this.clearFile();
        this.alert = {
          type: "success",
          message: "Enregistrement effectué avec succès",
        };
        this.showAlert = true;
        this._changeDetectorRef.detectChanges();
      },
      error: (error) => {
        // Affichage d'un message d'erreur
        console.error("Error : ", JSON.stringify(error));
        this.alert = {
          type: "error",
          message: error.error.message ?? error.message,
        };
        this.showAlert = true;
        this.isLoading = false;
        this._changeDetectorRef.detectChanges();
      },
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

  clearFile() {
    this._tableDataService.setDatas$([]);
    this.salaireForm.get("fichierSalaire")?.setValue(this.label);
    this.headerData = {};
    this.totalData = {};
    this.totalRows = 0;
    this.hasError = false;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = null;
    }

    this._changeDetectorRef.detectChanges();
  }

  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      this.detailsData=[];
      this.fileExtension = selectedFile.name.split(".").pop().toLowerCase();
      const fileNameWithExtension = selectedFile.name;
      const fileNameWithoutExtension:string = fileNameWithExtension.split('.').slice(0, -1).join('.')??"";
      this.nomFichierCharger = fileNameWithoutExtension;
      this.salaireForm.get('fichierSalaire')?.setValue(fileNameWithoutExtension);
    
      this._changeDetectorRef.markForCheck();
      if (this.fileExtension === "txt") {
        // Traiter le fichier comme un fichier texte
      
        this.processTextFile(selectedFile);
      } else if (this.fileExtension === "xlsx") {
        // Traiter le fichier comme un fichier Excel
        this.processExcelFile(selectedFile);
      } else {
        // Gérer le cas où l'extension de fichier n'est ni txt ni xlsx
        this.alert = { type: 'error', message: "Format de fichier non pris en charge." };
        // Show the alert
        this.showAlert = true;
        
        this._changeDetectorRef.markForCheck();
      }

      
    }
  }

  processTextFile(selectedFile: File) {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const fileContent = e.target.result as string;
      const lines = fileContent.split("\n"); // Split the content into lines
      const totalLines = lines.length;
      for (let i = 0; i < totalLines; i++) {
        const line = lines[i];
        // Extrait les valeurs de l'en-tête du fichier
        if (i === 0) {
          this.extractHeaderValues(line);
        }
        // Extrait les détails pour chaque ligne, excepté la première et la dernière
        if (i > 0 && i < totalLines - 2) {
          this.detailsData.push(this.extractDetails(line));
        }
        // Extrait les données totales de la dernière ligne
        if (i === totalLines - 2) {
          this.extractTotalData(line);
        }


        
      }
      // Après avoir traité toutes les lignes
      if (this.detailsData.length > 0) {
        this._tableDataService.setDatas$(this.detailsData);
        this.totalRows = this.detailsData.length;
      }
      this.isLoading = false;
      this._changeDetectorRef.markForCheck();
    };
    fileReader.readAsText(selectedFile, "ISO-8859-1");
  }

  processExcelFile(selectedFile: File) {
    const fileReader = new FileReader();
   // this.addRibColumn();
    console.log(selectedFile, "selectedFile");
    fileReader.onload = (e) => {
      const arrayBuffer = e.target.result;
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      this._tableDataService.setDatas$(
        rawData.slice(1).map((row) => ({
          nom: row[0],
          guichet: row[4],
           compte : row[5],
           montant : row[2],
           libelle : row[1],
           banque : row[3],
           cleRib : row[6],
        }))
      );
    
      
    };
    fileReader.readAsArrayBuffer(selectedFile);
  }



  convertDateToDateTime(dateStr: string): string {
    if (dateStr.length !== 5) {
      // Vérifier la longueur de la chaîne d'entrée
      console.error(
        "La chaîne de date doit avoir une longueur de 6 caractères."
      );
      this.alert = {
        type: "error",
        message: "La chaîne de date doit avoir une longueur de 6 caractères.",
      };
      this.hasError = true;

      this.showAlert = true;
      return "";
    }

    try {
      const day = parseInt(dateStr.substring(0, 2));
      const month = parseInt(dateStr.substring(2, 4)) - 1;
      const year = parseInt(dateStr.substring(4, 5)) + 2020;

      if (isNaN(year) || isNaN(month) || isNaN(day)) {
        this.hasError = true;

        return "";
      }

      const dateEmission = new Date(year, month, day);
      return dateEmission.toISOString().substring(0, 10);
    } catch (error) {
      this.hasError = true;

      console.error(
        "Erreur lors de la conversion de la date : " + error.message
      );
      return "";
    }
  }
  // const dateEmission = convertDateToDateTime(dateStr);
  extractHeaderValues(headerLine: string) {
    console.log("headerLine", headerLine);
    const compteCrediteRaw = headerLine.substring(22, 33).trim();
    const compteCredite =
      compteCrediteRaw[0] === "0"
        ? compteCrediteRaw.substring(1)
        : compteCrediteRaw;
    const dateOperStartIndex = compteCrediteRaw[0] === "0" ? 64 : 63;
    this.headerData = {
      nomFichier: this.nomFichierCharger,
      nomFichierGenerer: "nomParDefaut",
      codeEnreg: headerLine.substring(0, 2).trim(),
      codeOperation: headerLine.substring(2, 4).trim(),
      numLigne: parseInt(headerLine.substring(4, 12).trim(), 10),
      codeEmeteur: headerLine.substring(12, 18).trim(),
      codccd: headerLine.substring(18, 19).trim(),
      dateEch: this.convertDateToDateTime(headerLine.substring(25, 30).trim()),
      nom: headerLine.substring(30, 54).trim(),
      refer: headerLine.substring(54, 61).trim(),
      indrel: headerLine.substring(80, 81).trim(),
      guichet: headerLine.substring(86, 91).trim(),
      compte: headerLine.substring(91, 102).trim(),
      idenf: headerLine.substring(102, 118).trim(),
      banque: headerLine.substring(149, 154).trim(),
      compteCredite: compteCredite,
      zoneVide: "zoneVide",
    };
  }

  extractTotalData(data: string) {
    const codeEnreg = data.substring(0, 2).trim();
    const codeOperation = data.substring(2, 4).trim();
    const codeEmeteur = data.substring(12, 18).trim();
    const numligne = data.substring(4, 12).trim();
    const montant = data.substring(102, 118).trim();
    
    // const numLigne = data.substring(4, 12).trim() || null;
    // const dateEmission =  this.convertDateToDateTime(data.substring(8, 14).trim()) || null;

    //this.nombreprelevement=data.length;
    this.totalData = {
      codeEnreg,
      codeOperation,
      codeEmeteur,
      numligne,
      montant,
    };
  }

  extractDetails(data: string): {
    codeEnreg;
    codeOperation;
    numligne;
    codeEmeteur;
    nom;
    domici;
    guichet;
    compte;
    montant;
    libelle;
    banque;
  } {
    const codeEnreg = data.substring(0, 2).trim();
    const codeOperation = data.substring(2, 4).trim();
    const numligne = data.substring(4, 12).trim();
    const codeEmeteur = data.substring(12, 18).trim();
    const nom = data.substring(30, 54).trim();
    const domici = data.substring(54, 79).trim();
    const guichet = data.substring(86, 91).trim();
    const compte = data.substring(92, 103).trim();
    const montant = data.substring(103, 119).trim();
    const libelle = data.substring(119, 150).trim();
    const banque = data.substring(150, 155).trim();
    return {
      codeEnreg,
      codeOperation,
      numligne,
      codeEmeteur,
      nom,
      domici,
      guichet,
      compte,
      montant,
      libelle,
      banque,
    };
  }

  loadCompte(){
    this._salaireAllerService.compteEntreprises$.pipe(takeUntil(this._unsubscribeAll)
    ).subscribe({
        next: (response:any) => {
          console.log("Response compteEntreprises ===>", response);
          if(response==null){response=[];}
          this.listeCompteEntreprise = response.data;
          this._changeDetectorRef.markForCheck();
        }, 
        error: (error) => {
          //not show historique
          //this.showData = false;
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
