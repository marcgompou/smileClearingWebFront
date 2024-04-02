import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatDrawer } from "@angular/material/sidenav";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { FuseAlertType } from "@fuse/components/alert";
import { Remise } from "../remise.type";
import { DetailsChequeComponent } from "../../remise-aller/remise-aller/details-cheque/details-cheque.component";
import { UntypedFormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CreerRemiseService } from "../../remise-aller/remise-aller/remise.service";
import { TableDataService } from "../../common/table-data/table-data.services";
import { FuseMediaWatcherService } from "@fuse/services/media-watcher";
import { Subject, map, takeUntil } from "rxjs";
import { ImprimerRemiseService } from "../imprimer-remise/imprimer-remise.service";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { DeleteChequeConfirmationComponent } from "../../remise-aller/remise-aller/details-cheque/delete-confirmation/delete-cheque-confirmation.component";
import { DetailsRemiseComponent } from "../../valider-remise/details-remise/details-remise.component";
// import { jsPDF } from "jspdf";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { UserService } from "app/core/user/user.service";
import { User } from "app/core/user/user.types";
import { LogoBGG } from "../../common/imagesBase64/logoBBG";
import { fuseAnimations } from "@fuse/animations/public-api";

@Component({
  selector: "app-details-remise",
  templateUrl: "./details-imprimer.component.html",
  styleUrls: ["./details-imprimer.component.scss"],
  animations: fuseAnimations,
})
export class DetailsImprimerComponent implements OnInit {
  @ViewChild("matDrawer", { static: true }) matDrawer: MatDrawer;
  drawerMode: "side" | "over";
  remiseData: any;
  qrCodeData: string;
  montantTotal: number = 0;
  nombreRemise: number = 0;

  remiseIsInCorrect: boolean = true;
  id: string = "";
  isLoading = false;
  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;
  user: User;
  received: Remise[] = [];
  totalRows = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 25];

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  alert: { type: FuseAlertType; message: string } = {
    type: "success",
    message: "",
  };
  chequeData: any;
  remiseImprimerData: any;
  showAlert: boolean = false;

  public dataStructure = [
    {
      key: "reference",
      label: "Reference",
    },

    {
      key: "dateCreation",
      label: "Date de creation",
    },
    {
      key: "numCompte",
      label: "Numero de compte",
    },
    {
      key: "nbCheques",
      label: "Nombre de Cheque",
    },
    {
      key: "mtTotal",
      label: "Montant Total",
    },
  ];

  public displayedColumns: string[] = [
    "reference",
    "dateCreation",
    "numCompte",
    "nbCheques",
    "mtTotal",
  ];

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _userService: UserService,
    private _formBuilder: UntypedFormBuilder,
    private _imprimerRemiseService: ImprimerRemiseService,
    private _tableDataService: TableDataService,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _dialog: MatDialog,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) {}
  ngOnInit(): void {
    //Recuperation de la ligne selectionner dans la liste des remise de tableData common
    this._tableDataService.data$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response) => {
        console.log("details imprimer remise response=======>", response);
        this.remiseImprimerData = response;
      });

    this._activatedRoute.params.subscribe((params) => {
      this.id = params["id"];
      console.log("id in details", this.id);
    });

    this._userService.user$.subscribe((user: User) => {
      console.log("user in details ===", user);
      this.user = user;
    });

    this._fuseMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ matchingAliases }) => {
        // Set the drawerMode if the given breakpoint is active
        if (matchingAliases.includes("lg")) {
          this.drawerMode = "side";
        } else {
          this.drawerMode = "over";
        }
        // Mark for check
        this._changeDetectorRef.markForCheck();
      });
  }
  imprimerPDF(nomEntreprise: string) {
    //Affichage de la barre de chargement
    this.isLoading = true;

    this._imprimerRemiseService
      .getRemiseImprimer(this.id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response) => {
          console.log("responsetest", response);
          //Permet d'initialiser les polices à utiliser

          const imageBlocks = response.data.map(el => ({
            image: el.imagerecto,
            width: 100, // adjust the width as needed
            alignment: 'center',
            margin: [0, 10, 0, 20], // adjust the margins as needed
          }));

          pdfMake.vfs = pdfFonts.pdfMake.vfs;

          const currentDate: Date = new Date();
          // this.qrcodeData = this.qrcodeService.generate(currentDate).subscribe((data) => {
          //   this.qrCodeData = data;
          // });
          const mois: string[] = [
            "Janvier",
            "Février",
            "Mars",
            "Avril",
            "Mai",
            "Juin",
            "Juillet",
            "Août",
            "Septembre",
            "Octobre",
            "Novembre",
            "Décembre",
          ];
          const formattedDate: string = `${(currentDate.getDate() < 10 ? "0" : "") + currentDate.getDate() } ${
            mois[currentDate.getMonth()]
          } ${currentDate.getFullYear()}`;
          var headers = ["N° Chèque","Code banque","Agence", "Compte", "Clé RIB", "Montant"];
          //Code BANQUE, N cheque, Agence, Compte (titulaire) , clerib , mongant
          //Generation du pdf
          const documentDefinition = {
            pageSize: "A4",
            pageMargins: [20, 60, 40, 80],
            header: function (currentPage, pageCount, pageSize) {
              // you can apply any logic and return any valid pdfmake element
              return [
                {
                  columns: [
                    {
                      columns: [
                        {
                          width: "*",
                          text:"Entreprise : " + nomEntreprise,
                          alignment: "left",
                          fontSize: 14,
                          bold: true,
                          margin: [20, 20, 0, 0],
                        },
                        {
                          image: LogoBGG,
                          fit: [150, 40],
                          alignment: "right",
                          margin: [0, 20, 20, 0],
                        },
                      ],
                    },
                  ],
                },
              ];
            },
            footer: function (currentPage, pageCount) {
              return {
                text: "-"+currentPage.toString() + " sur " + pageCount+"-",
                alignment: "center",
                fontSize: 12,
              };
            },
            content: [
              {
                alignment: "left",
                bold: true,

                text: "Date : " + formattedDate,
                margin: [0, 0, 0, 0],
              },
              {
                alignment: "center",
                bold: true,
                text: "LISTE DES CHEQUES EXPORTES",
                margin: [0, 35, 0, 30],
              },
              {
                style: "tableExample",
                alignement:'center',
                margin: [30, 0, 20, 0],
                table: {
                  headerRows: 1,
                  body: [
                    headers,
                    ...response.data.map((item) => [

                      item.numChqTitu,
                      item.codeBanqueTitu,
                      item.agenceRem,
                      item.numCompteTitu,
                      item.cleRibTitu,
                      { text: item.montant, alignment: "right" },
                    ]),
                    [
                      { text: "Montant Total", colSpan: 5 },
                      {},
                      {},
                      {},
                      {},
                      {
                        text: response.data.reduce(
                          (sum, d) => sum + d.montant,
                          0
                        ),
                        alignment: "right",
                      },
                    ],
                  ],
                  widths: [60,80,50,100,50,100], // Largeurs des colonnes, ajustez-les selon vos besoins
                },
              },
            ],
            styles: {
              header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 0],
                decoration: "underline",
              },
              subheader: {
                fontSize: 16,
                bold: true,
                margin: [0, 10, 0, 5],
              },
              tableExample: {
                //alignment: "center",
                margin: [10, 5, 10, 10],
              },
              tableHeader: {
                bold: true,
                fontSize: 13,
                color: "black",
              },
            },
          };
          pdfMake.createPdf(documentDefinition).open();
        },
        error: (error) => {
          //not show historique
          //this.showData = false;
          console.error("Error : ", JSON.stringify(error));
          // Set the alert
          this.alert = {
            type: "error",
            message: error?.error?.message ?? error?.error,
          };
          // Show the alert
          // this.showAlert = false;
          // this._changeDetectorRef.markForCheck();
        },
        complete: () => {
          this.isLoading = false;
          this._changeDetectorRef.markForCheck();
        },
      });
  }
  onBackdropClicked(): void {
    // Go back to the list
    this._router.navigate(["../../"], { relativeTo: this._activatedRoute });

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  goBackToList(): void {
    // Go back to the list
    this._router.navigate(["../../"], { relativeTo: this._activatedRoute });

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }
  validerRemise() {
    console.log("valider remise id", this.chequeData);
    this._imprimerRemiseService
      .validerRemise(this.chequeData.id)
      .pipe()
      .subscribe({
        next: (response) => {
          console.log(response);
          this.goBackToList();
        },
      });
  }

  supprimerRemise() {
    const deleteObjectDialog = this._dialog.open(
      DeleteChequeConfirmationComponent,
      {
        data: {
          id: this.id,
          cheques: null,
          endpoint: "exportation",
        },
      }
    );
    deleteObjectDialog.afterClosed().subscribe({
      next: (response) => {
        console.log("delete response=====>", response);
        if (response?.isDeleted) {
          this.goBackToList();
          console.log("delete remise response===>", response);
        }
      },
      error: (error) => {
        console.error("Error : ", JSON.stringify(error));
        this.alert = {
          type: "error",
          message: error.error.message ?? error.message,
        };
        this.showAlert = true;
        this._changeDetectorRef.detectChanges();
      },
    });
  }

  closeAlert() {
    this.showAlert = false; // Définir showAlert à false pour masquer l'alerte lorsque l'utilisateur clique sur la croix
  }
  selectedRow(row) {
    const index = this.dataSource.data.indexOf(row);
    this._router.navigate(["./details", index], {
      relativeTo: this._activatedRoute,
    });
    this._changeDetectorRef.markForCheck();
    this.remiseData = row;
  }

  updateList(newMatTable: MatTableDataSource<any>) {
    this.dataSource = newMatTable;
    this._changeDetectorRef.markForCheck();
  }

  getColumnHeaderText(column: string): string {
    //  console.log("column===>",column)
    let found = this.dataStructure.find((e) => e.key == column);
    return found ? found.label : "";
  }
}
