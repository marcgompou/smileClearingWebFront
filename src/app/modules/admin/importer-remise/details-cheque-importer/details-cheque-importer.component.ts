import {
  ChangeDetectorRef,
  Component,
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
import { Subject, takeUntil } from "rxjs";
import { ImporterRemiseService } from "../importer-remise/importer-remise.service";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { DeleteChequeConfirmationComponent } from "../../remise-aller/remise-aller/details-cheque/delete-confirmation/delete-cheque-confirmation.component";
import { fuseAnimations } from "@fuse/animations/public-api";

@Component({
  selector: "app-details-cheque-importer",
  templateUrl: "./details-cheque-importer.component.html",
  styleUrls: ["./details-cheque-importer.component.scss"],
  animations: fuseAnimations,
})
export class DetailsChequeImporterComponent implements OnInit {
  @ViewChild("matDrawer", { static: true }) matDrawer: MatDrawer;
  drawerMode: "side" | "over";
  noData: any;
  remiseData: any;
  montantTotal: number = 0;
  nombreRemise: number = 0;
  remiseIsInCorrect: boolean = true;
  id: string = "";
  isLoading = false;

  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;

  action = "CONNECT";
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
  showAlert: boolean = false;

  public dataStructure = [
    {
      key: "numChq",
      label: "Numero de cheque",
    },
    {
      key: "codeBanque",
      label: "Code banque",
    },
    {
      key: "titulaire",
      label: "Titulaire",
    },
    {
      key: "agence",
      label: "Code agence",
    },
    {
      key: "cleRib",
      label: "Clé RIB",
    },
    {
      key: "montant",
      label: "Montant",
    },
  ];

  public displayedColumns: string[] = [
    "numChq",
    "codeBanque",
    "titulaire",
    "agence",
    "cleRib",
    "montant",
  ];
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

  getColumnHeaderText(column: string): string {
    //  console.log("column===>",column)
    let found = this.dataStructure.find((e) => e.key == column);
    return found ? found.label : "";
  }

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _formBuilder: UntypedFormBuilder,
    private _chequeService: CreerRemiseService,
    private _validerRemiseService: ImporterRemiseService,
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
        console.log("details cheque remise response=======>", response);
        this.chequeData = response;
      });

    this._tableDataService.datas$.pipe().subscribe((response) => {
      console.log("details cheque   dsfd remise response=======>", response);
    });

    this._activatedRoute.params.subscribe((params) => {
      this.id = params["id"];
      console.log("id in details", this.id);
    });

    // Subscribe to MatDrawer opened change
    this.matDrawer.openedChange.subscribe((opened) => {
      if (!opened) {
        // Mark for check
        this._changeDetectorRef.markForCheck();
      }
    });

    // Subscribe to media changes
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

  validerRemise() {
    console.log("valider remise id", this.chequeData);
    this._validerRemiseService
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
          endpoint: "remise",
        },
      }
    );
    deleteObjectDialog.afterClosed().subscribe({
      next: (response) => {
        console.log("delete response=====>", response);
        if (response?.isDeleted) {
          this.goBackToList();
          console.log("delete remise response===>", response);
          this.alert = { type: "success", message: response.message };
          this.showAlert = true;
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

  openDetailComponent(component: DetailsChequeComponent) {
    component.matDrawer = this.matDrawer;
    component.formTitle = "DETAILS CHEQUE";
    component.chequeData = this.chequeData;
    //Endpoint pour supprimer un cheque
    component.endpoint = "remise/suppression/cheque";
    //Initialisation formulaire details
    component.formFields = [
      {
        key: "numChq",
        libelle: "N° de Cheque",
        validators: {
          min: 7,
          max: 7,
          required: true,
        },
      },
      {
        key: "codeBanque",
        libelle: "Code Banque",
        placeholder: "Ex: CI131",
        validators: {
          min: 5,
          max: 5,
          required: true,
        },
      },
      {
        key: "agence",
        libelle: "Code Agence",
        placeholder: "Ex: 01001",
        validators: {
          min: 5,
          max: 5,
          required: true,
        },
      },
      {
        key: "cleRib",
        libelle: "Cle Rib",
        validators: {
          min: 2,
          max: 50,
          required: true,
        },
      },
      {
        key: "montant",
        libelle: "Montant",
        type: "number",
        validators: {
          minValue: 1000,
          min: 1,
          max: 11,
          required: true,
        },
      },
      {
        key: "titulaire",
        libelle: "Titulaire",
        validators: {
          max: 50,
        },
      },
    ];
  }
}
