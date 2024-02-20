import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormControl,
  FormGroup,
} from "@angular/forms";
import { PageEvent } from "@angular/material/paginator";
import { Subject } from "rxjs";
import { fuseAnimations } from "@fuse/animations";
import { ActivatedRoute, Router } from "@angular/router";
import { MatTableDataSource } from "@angular/material/table";
import { FuseAlertType } from "@fuse/components/alert";
import { PrelevementInterbancaireService } from "../prelevement-interbancaire.service";
import { TableDataService } from "../../common/table-data/table-data.services";

@Component({
  selector: "app-prelevement-interbancaire",
  templateUrl: "./prelevement-interbancaire.component.html",
  styleUrls: ["./prelevement-interbancaire.component.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations,
})
export class PrelevementInterbancaireComponent implements OnInit, OnDestroy {
  nomFichierChargerNormal: string | undefined;
  /**Prelevement data */
  headerData: any = {};
  totalData: any = {};
  detailsData: any[] = [];
  /**Prelevement data */
  label = "Charger fichier prélèvement";
  //Form
  @ViewChild("fileInput", { static: false }) fileInput: any;

  /**MatTable */
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  /**MatTable */
  alert: { type: FuseAlertType; message: string } = {
    type: "success",
    message: "",
  };
  showAlert: boolean = false;

  isLoading = false;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  prelevementForm: FormGroup;
  nomFichierCharger: string = "";
  dataStructure = [
    // { key: 'codeOperation', label: 'Code Operation' },
    { key: "codeEnreg", label: "Code Enreg" },
    { key: "nomDebite", label: "Nom Client Debite" },
    // { key: 'typeRibDonneurOrdre', label: 'Type RIB DO' },
    { key: "ribDebite", label: "RIB client Debite" },
    { key: "montant", label: "Montant", type: "montant" },
    { key: 'dateOpe', label: 'Date Operation',type:"date" },
    { key: "nomClientDonneurOrdre", label: "Nom Donneur Ordre" },
    { key: "numAutorisation", label: "Num. Autorisation" },
    { key: "libelleTransaction", label: "Libelle Transaction " },
    { key: "RefEmetteur", label: "Ref Emetteur" },
  ];

  displayedColumns: string[] = [
    "codeEnreg",
    "nomDebite",
    "ribDebite",
    "montant",
    "dateOpe",
    "nomClientDonneurOrdre",
    "numAutorisation",
    "libelleTransaction",
    "RefEmetteur",
  ];
  totalRows: number = 0;
  nombreprelevement: number;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _formBuilder: UntypedFormBuilder,
    private _prelevementInterbancaireService: PrelevementInterbancaireService,
    private _tableDataService: TableDataService
  ) {
    this.prelevementForm = this._formBuilder.group({
      fichierPrelevement: [""], //
    });
  }

  //CYCLE DE VIE
  ngOnInit() {
    this._tableDataService.setDatas$([]);
    this.prelevementForm.get("fichierPrelevement")?.setValue(this.label);
  }

  // closeAlert() {
  //   this.showAlert = false; // Définir showAlert à false pour masquer l'alerte lorsque l'utilisateur clique sur la croix
  // }

  onSubmit() {
    this.showAlert = false;
    this.isLoading = true;
    let data = {
      prelevementEntete: this.headerData,
      prelevementDetails: this.detailsData,
      prelevementTotal: this.totalData,
    };

    this._prelevementInterbancaireService.createPrelevement(data).subscribe({
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
    this.prelevementForm.get("fichierPrelevement")?.setValue(this.label);
    this.headerData = {};
    this.totalData = {};
    this.totalRows = 0;

    if (this.fileInput) {
      this.fileInput.nativeElement.value = null;
    }

    this._changeDetectorRef.detectChanges();
  }

  onFileSelected(event: any) {
    try {
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        this.detailsData = [];
        const fileNameWithExtension = selectedFile.name;
        const fileNameWithoutExtension: string =
          fileNameWithExtension.split(".").slice(0, -1).join(".") ?? "";
        this.nomFichierCharger = fileNameWithoutExtension;

        this.prelevementForm
          .get("fichierPrelevement")
          ?.setValue(fileNameWithoutExtension);
        // Now, you can read the file content or perform other operations with it.
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
          const fileContent = e.target.result as string;
          const lines = fileContent.split("\n"); // Split the content into lines
          const totalLines = lines.length;
          for (let i = 0; i < totalLines; i++) {
            const line = lines[i];
            // CALL FUNCTION TO RETRIEVE THE HEADER
            if (i === 0) {
              this.extractHeaderValues(line);
            }
            //Details
            if (i > 0 && i < totalLines - 1) {
              this.detailsData.push(this.extractDetails(line));
            }
            // CALL FUNCTION TO RETRIEVE THE LAST LINE
            // if (i === totalLines-2) {
            //   this.extractTotalData(line);
            // }
          }
          if (this.detailsData.length > 0) {
            this._tableDataService.setDatas$(this.detailsData);
            this.totalRows = this.detailsData.length;
          }
          this._changeDetectorRef.markForCheck();
        };
        fileReader.readAsText(selectedFile, "ISO-8859-1");
      } else {
        console.error("No file selected.");
      }
    } catch (error) {
      console.log(error);
      this.alert = {
        type: "error",
        message: error.error.message ?? error.message,
      };
      this.showAlert = true;
    } finally {
      this._tableDataService.setDatas$([]);
      this.isLoading = false;
      this._changeDetectorRef.detectChanges();
    }
  }

  convertDateToDateTime(dateStr: string): string {
    if (dateStr.length !== 6) {
      // Vérifier la longueur de la chaîne d'entrée
      console.error(
        "La chaîne de date doit avoir une longueur de 6 caractères."
      );
      return "";
    }

    try {
      const day = parseInt(dateStr.substring(0, 2));
      const month = parseInt(dateStr.substring(2, 4)) - 1;
      const year = parseInt(dateStr.substring(4, 6)) + 2000;

      if (isNaN(year) || isNaN(month) || isNaN(day)) {
        return "";
      }

      const dateEmission = new Date(year, month, day);
      return dateEmission.toISOString().substring(0, 10);
    } catch (error) {
      console.error(
        "Erreur lors de la conversion de la date : " + error.message
      );
      return "";
    }
  }
  // const dateEmission = convertDateToDateTime(dateStr);
  extractHeaderValues(headerLine: string) {
    console.log("headerLine", headerLine);
    // const compteCrediteRaw = headerLine.substring(22, 33).trim();
    // const compteCredite = compteCrediteRaw[0] === '0' ? compteCrediteRaw.substring(1) : compteCrediteRaw;
    // const dateOperStartIndex = compteCrediteRaw[0] === '0' ? 64 : 63;
    const montantTotal = headerLine.substring(23, 49).trim();
    console.log("mnt", montantTotal);
    //const codeOperation = data.substring(0, 2).trim();
    // const montantTotal: headerLine.substring(23, 16).trim(),
    this.headerData = {
      nomFichier: this.nomFichierCharger,
      nomFichierGenerer: "nomParDefaut",
      Info: headerLine.substring(0, 1).trim(),
      type: headerLine.substring(1, 4).trim(),
      codeagence: headerLine.substring(5, 10).trim(),
      numerofichier: headerLine.substring(10, 16).trim(),
      devise: headerLine.substring(16, 19).trim(),
      nombedeligne: headerLine.substring(19, 23).trim(),
      montantTotal: headerLine.substring(23, 49).trim(),
      //
    };
  }

  // extractTotalData(data: string) {
  //   const codeOperation = data.substring(0, 2).trim();
  //   const codeEnreg = data.substring(2, 3).trim();
  //   const numLigne = data.substring(3, 8).trim() || null;
  //   const dateEmission =  this.convertDateToDateTime(data.substring(8, 14).trim()) || null;
  //   const zoneVide1 = data.substring(14, 22).trim();
  //   const compte = data.substring(22, 33).trim() || null;
  //   const zoneVide2 = data.substring(33, 108).trim();
  //   const montant =data.substring(104, 116).trim() || null;
  //   const zoneVide3 = data.substring(116, 128).trim();
  //   //this.nombreprelevement=data.length;
  //   this.totalData= {
  //       codeOperation,
  //       codeEnreg,
  //       numLigne,
  //       dateEmission,
  //       zoneVide1,
  //       compte,
  //       zoneVide2,
  //       montant,
  //       zoneVide3,
  //   };

  // }

  extractDetails(data: string): {
    codeAgenceDonneurDordre;
    codePays;
    etat;
    devise;
    type;
    dateOpe;
    infosup;
    codeOperation;
    codeEnreg;
    typeRibDonneurOrdre;
    ribDonneurOrdre;
    typeRibDebite;
    ribDebite;
    montant;
    nomClientDonneurOrdre;
    numAutorisation;
    nomDebite;
    libelleTransaction;
    RefEmetteur;
    zoneVide;
    //Champ non significatif 149 Rempli avec des blancs
  } {
    const codeAgenceDonneurDordre = data.substring(0, 5).trim();
    const codePays = data.substring(5, 7).trim();
    const etat = data.substring(7, 8).trim();
    const devise = data.substring(8, 10).trim();
    const type = data.substring(10, 13).trim();
    const dateOpe = this.convertDateToDateTime(data.substring(13, 19).trim()) || null;
    const infosup = data.substring(19, 35).trim();
    const codeOperation = data.substring(35, 38).trim();
    const codeEnreg = data.substring(38, 46).trim();
    const typeRibDonneurOrdre = data.substring(46, 47).trim();
    const ribDonneurOrdre = data.substring(47, 71).trim();
    const typeRibDebite = data.substring(71, 71).trim();
    const ribDebite = data.substring(72, 96).trim();
    const montant = parseFloat(data.substring(96, 112).trim()) || null;
    const nomClientDonneurOrdre = data.substring(112, 147).trim();
    const numAutorisation = data.substring(147, 157).trim();
    const nomDebite = data.substring(157, 192).trim();
    const libelleTransaction = data.substring(192, 262).trim();
    const RefEmetteur = data.substring(262, 286).trim();
    const zoneVide = "zoneVide";
    return {
      codeAgenceDonneurDordre,
      codePays,
      etat,
      devise,
      type,
      dateOpe,
      infosup,
      codeOperation,
      codeEnreg,
      typeRibDonneurOrdre,
      ribDonneurOrdre,
      typeRibDebite,
      ribDebite,
      montant,
      nomClientDonneurOrdre,
      numAutorisation,
      nomDebite,
      libelleTransaction,
      RefEmetteur,
      zoneVide,
    };
  }
}
