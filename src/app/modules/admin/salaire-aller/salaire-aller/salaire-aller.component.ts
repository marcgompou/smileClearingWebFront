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
  fileExtension: string = "";

  alert: { type: FuseAlertType; message: string } = {
    type: "success",
    message: "",
  };
  showAlert: boolean = false;

  isLoading = false;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  salaireForm: FormGroup;
  nomFichierCharger: string = "";
  codeEnreg;
  nomBeneficiaire;
  domiciliation;
  guichet;
  compte;
  montant;
  libelle;
  banque;
  codeOperation;
  dateEcheance;
  nomEntreprise;
  numligne;
  codeEmeteur;
  numCompte;
  dataStructureTxt: any[] = [
    { key: "codeEnreg", label: "Code Enreg" },
    { key: "nomBeneficiaire", label: "Béneficiaire" },
    { key: "domiciliation", label: "Domiciliation" },
    { key: "banque", label: "Banque" },
    { key: "guichet", label: "Guichet" },
    { key: "compte", label: "Compte Credité" },
    { key: "montant", label: "Montant", type: "montant" },
    { key: "libelle", label: "Libellé Opérat" },
  ];

  displayedColumnsTxt: string[] = this.dataStructureTxt.map((o) => o.key);

  dataStructureXls: any[] = [
    { key: "nomBeneficiaire", label: "Béneficiaire" },
    { key: "banque", label: "Banque" },
    { key: "guichet", label: "Guichet" },
    { key: "compte", label: "Compte Credité" },
    { key: "montant", label: "Montant", type: "montant" },
    { key: "libelle", label: "Libellé Opérat" },
    { key: "cleRib", label: "Cle Rib" },
  ];

  displayedColumnsXls: string[] = this.dataStructureXls.map((o) => o.key);

  totalRows: number = 0;
  nombreSalaire: number;
  hasError = false;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _formBuilder: UntypedFormBuilder,
    private _salaireAllerService: SalaireAllerService,
    private _tableDataService: TableDataService
  ) // private _compteEntreprises: BehaviorSubject<CompteEntreprises[] | null> = new BehaviorSubject(null);

  {
    this.salaireForm = this._formBuilder.group({
      fichierSalaire: [""], //
      idCompteClient: ["", Validators.required],
    });
  }

  //CYCLE DE VIE
  ngOnInit() {
    // this._tableDataService.setDatas$([]);
    this.salaireForm.get("fichierSalaire")?.setValue(this.label);
    this.loadCompte();
  }
  onSubmit() {
    this.showAlert = false;
    this.isLoading = true;
    const comptetest = this.listeCompteEntreprise.find(
      (x) => x.compte == this.salaireForm.value.idCompteClient
    );
    const codeGuichet = comptetest.agence;
    const nomCompteClient = comptetest.designation;
    const compte = this.salaireForm.value.idCompteClient;
    console.log(
      "comptetest----------------comptetest----------------",
      comptetest
    );
    let data = {
      salaireEntete: {
        // Autres propriétés...

        nomFichier: this.nomFichierCharger,
        nomFichierGenerer: "nomParDefaut",
        codeEnreg: this.headerData.codeEnreg,
        codeOperation: this.headerData.codeOperation,
        numLigne: this.headerData.numLigne,
        codeEmeteur: this.headerData.codeEmeteur,
        codccd: this.headerData.codccd,
        dateEcheance: this.headerData.dateEcheance,
        nomEntreprise: this.headerData.nomEntreprise,
        refer: this.headerData.refer,
        indrel: this.headerData.indrel,
        guichet: codeGuichet,
        compte: compte,
        idenf: this.headerData.idenf,
        banque: this.headerData.banque,
        compteCredite: this.salaireForm.get("idCompteClient").value,
        zoneVide: "zoneVide",
        extension: this.headerData.extension,
      },
      //salaireEntete:this.headerData,

      //compte :  ,
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
      this.detailsData = [];
      this.fileExtension = selectedFile.name.split(".").pop().toLowerCase();
      const fileNameWithExtension = selectedFile.name;
      const fileNameWithoutExtension: string =
        fileNameWithExtension.split(".").slice(0, -1).join(".") ?? "";
      this.nomFichierCharger = fileNameWithoutExtension;
      this.salaireForm
        .get("fichierSalaire")
        ?.setValue(fileNameWithoutExtension);

      this._changeDetectorRef.markForCheck();
      if (this.fileExtension === "txt") {
        // Traiter le fichier comme un fichier texte

        this.processTextFile(selectedFile);
      } else if (this.fileExtension === "xlsx") {
        // Traiter le fichier comme un fichier Excel
        this.processExcelFile(selectedFile);
      } else {
        // Gérer le cas où l'extension de fichier n'est ni txt ni xlsx
        this.alert = {
          type: "error",
          message: "Format de fichier non pris en charge.",
        };
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
        if (line.substring(0, 2).trim() === "03") {
          this.extractHeaderValues(line);
        }
        // Extrait les détails pour chaque ligne, excepté la première et la dernière
        if (line.substring(0, 2).trim() === "06") {
          this.detailsData.push(this.extractDetails(line));
        }
        // Extrait les données totales de la dernière ligne
        if (line.substring(0, 2).trim() === "08") {
          this.extractTotalData(line);
        }
      }
      // Après avoir traité toutes les lignes
      if (this.detailsData.length > 0) {
        this._tableDataService.setDatas$(this.detailsData);
        this.totalRows = this.detailsData.length;
      }
      // Exemple de code pour extraire le compte du fichier TXT

      // Récupération de la valeur du compte extraite de l'en-tête
      const compteTxt = this.headerData.compte;

      // Attribution de la valeur de compteTxt au contrôle de formulaire idCompteClient
      this.salaireForm.get("idCompteClient")?.setValue(this.headerData.compte);
      console.log("this.headerData.compte", this.headerData.compte);
      this.isLoading = false;
      this._changeDetectorRef.markForCheck();
    };
    fileReader.readAsText(selectedFile, "ISO-8859-1");
  }

  processExcelFile(selectedFile: File) {
    const fileReader = new FileReader();
    //const nomCompte = this.salaireForm.get('idCompteClient')?.value;

    // this.addRibColumn();
    console.log(selectedFile, "selectedFile");
    fileReader.onload = (e) => {
      const arrayBuffer = e.target.result;
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      this.totalRows = rawData.length - 1;
      const transformedData = rawData.slice(1).map((row) => ({
        nomBeneficiaire: row[0],
        guichet: row[4],
        compteCredite: row[5],
        compte: row[5],
        montant: row[2].toString(),
        libelle: row[1],
        banque: row[3],
        codeEmeteur: "",
        codeEnreg: "06",
        codeOperation: "",
        dateEcheance: "2020-07-02",
        domiciliation: "",

        numligne: this.totalRows.toString(),
        cleRib: row[6],
      }));

      this.fileExtension = selectedFile.name.split(".").pop().toLowerCase();
      // Mise à jour des données via le service
      this._tableDataService.setDatas$(transformedData);
      console.log("transformedData-------------------", transformedData);
      // Calcul du montant total en convertissant les valeurs en nombres et en s'assurant de ne pas inclure l'en-tête
      const montantTotal = transformedData.reduce(
        (acc, row) => acc + (Number(row.montant) || 0),
        0
      );
      // Affectation du montant total à this.totalData.montant
      this.totalData = {
        montant: montantTotal,
        codeEnreg: "08",
        codeOperation: "",
        codeEmeteur: "",
        numligne: this.totalRows.toString(),
      };
      this.detailsData = transformedData;
      this.isLoading = false;
      this._changeDetectorRef.markForCheck();
      //this.extension : this.fileExtension,
      this.headerData = {
        nomFichier: this.nomFichierCharger,
        nomFichierGenerer: "nomParDefaut",
        codeEnreg: "03",
        codeOperation: "02",
        numLigne: this.totalRows,
        codeEmeteur: "",
        codccd: "",
        dateEcheance: "",
        //nomEntreprise : headerLine.substring(30, 54).trim(),
        //   let nomCompte = ;
        nomCompte: this.salaireForm.value.idCompteClient,
        refer: "",
        indrel: "",
        guichet: "",
        //compte: transformedData.com,
        //idenf: headerLine.substring(102, 118).trim(),
        banque: "CI131",
        compte: this.salaireForm.value.idCompteClient,

        //this.form.get('compte').value
        zoneVide: "zoneVide",
        extension: this.fileExtension,
      };
      console.log(
        "compte------------recupcompte",
        this.salaireForm.get("idCompteClient").value
      );

      const fileContent = e.target.result as string;
      //const lines = fileContent.split("\n"); // Split the content into lines
      //const this.totalRows = lines.length;
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
      dateEcheance: this.convertDateToDateTime(
        headerLine.substring(25, 30).trim()
      ),
      nomEntreprise: headerLine.substring(30, 54).trim(),
      nomCompte: headerLine.substring(30, 54).trim(),
      refer: headerLine.substring(54, 61).trim(),
      indrel: headerLine.substring(80, 81).trim(),
      guichet: headerLine.substring(86, 91).trim(),

      compte: headerLine.substring(91, 103).trim(),
      idenf: headerLine.substring(102, 118).trim(),
      banque: headerLine.substring(149, 155).trim(),
      compteCredite: this.salaireForm.get("idCompteClient").value,
      zoneVide: "zoneVide",
      extension: this.fileExtension,
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
    dateEcheance;
    nomBeneficiaire;
    domiciliation;
    guichet;
    compte;
    montant;
    libelle;
    banque;
  } {
    const codeEnreg = data.substring(0, 2).trim();
    const codeOperation = data.substring(2, 4).trim();
    const dateEcheance = "2023-02-02";
    const numligne = data.substring(4, 12).trim();
    const codeEmeteur = data.substring(12, 18).trim();
    const nomBeneficiaire = data.substring(30, 54).trim();
    const domiciliation = data.substring(54, 79).trim();
    const guichet = data.substring(86, 91).trim();
    const compte = data.substring(91, 103).trim();
    const montant = data.substring(103, 119).trim();
    const libelle = data.substring(119, 150).trim();
    const banque = data.substring(150, 155).trim();
    return {
      codeEnreg,
      codeOperation,
      numligne,
      codeEmeteur,
      dateEcheance,
      nomBeneficiaire,
      domiciliation,
      guichet,
      compte,
      montant,
      libelle,

      banque,
    };
  }

  loadCompte() {
    this._salaireAllerService.compteEntreprises$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          console.log("Response compteEntreprises ===>", response);
          if (response == null) {
            response = [];
          }
          this.listeCompteEntreprise = response.data;
          this._changeDetectorRef.markForCheck();
        },
        error: (error) => {
          //not show historique
          //this.showData = false;
          console.error("Error : ", JSON.stringify(error));
          // Set the alert
          this.alert = {
            type: "error",
            message: error.error.message ?? error.error,
          };
          // Show the alert
          this.showAlert = true;

          this._changeDetectorRef.markForCheck();
        },
      });
  }
}
