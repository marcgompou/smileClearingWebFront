import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatDrawer } from "@angular/material/sidenav";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { FuseAlertType } from "@fuse/components/alert";
import { Prelevement } from "../../prelevement.type";
import { ActivatedRoute, Router } from "@angular/router";
import { TableDataService } from "../../../common/table-data/table-data.services";
import { FuseMediaWatcherService } from "@fuse/services/media-watcher";
import { Subject, takeUntil } from "rxjs";
import { TraitementPrelevementService } from "../traitement-prelevement.service";
import { DetailsComponent } from "app/modules/admin/common/details/details/details.component";
import { fuseAnimations } from "@fuse/animations";

@Component({
  selector: "app-details-prelevement",
  templateUrl: "./details-prelevement.component.html",
  styleUrls: ["./details-prelevement.component.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations,
})
export class DetailsPrelevementComponent implements OnInit {
  @ViewChild("matDrawer", { static: true }) matDrawer: MatDrawer;
  drawerMode: "side" | "over";
  noData: any;
  prelevementData: any;
  prelevementRemiseData: any;
  montantTotal: number = 0;
  nombreRemise: number = 0;
  remiseIsInCorrect: boolean = true;
  id: string = "";
  isLoading = false;

  totalRows = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 25];
  canRelance: boolean = false;
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
      key: "codeBanque",
      label: "Code banque",
    },
    {
      key: "codeagence",
      label: "Code agence",
    },
    {
      key: "numCompte",
      label: "Numero de Compte",
    },
    {
      key: "nomfichier",
      label: "Nom fichier",
    },

    {
      key: "montant",
      label: "Montant",
    },
    {
      key: "statut",
      type: "status",
      label: "Etat prelev.",
      statusValues: [
        { value: 1, libelle: "Enregistré", color: "#2986cc" }, // Green
        { value: 3, libelle: "Exporté", color: "#16537e" }, // Green
        { value: 13, libelle: "Payé", color: "#68D391" }, // Green
        { value: 10, libelle: "Debit. interdit", color: "#FF5733" }, // Orange
        { value: 40, libelle: "Cpte. fermé", color: "#808080" }, // Gray
        { value: 50, libelle: "Cpte. inexistant", color: "#FFD700" }, // Yellow
        { value: 60, libelle: "Rejeté", color: "#F56565" }, // Red
      ],
    },
    {
      key: "motif",
      label: "Motif",
    },
    {
      key: "nomClient",
      label: "Nom du Client",
    },
  ];
  public displayedColumns: string[] = [
    "codeBanque",
    "codeagence",
    "numCompte",
    "montant",
    "motif",
    "nomClient",
    "statut",
  ];

  public nomFichier: string = "-";
  montantTo: any;
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

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    // private _chequeService: CreerPrelevementService,
    private _traitementPrelevementService: TraitementPrelevementService,
    //private _telechargerPrelevementService:ValiderPrelevementService,
    private _tableDataService: TableDataService,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this._tableDataService.datas$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response) => {
        console.log(
          "details prelevementRemiseData 1111 response=======>",
          response
        );
        let result: any = response;
        try {
          let findPrelevToRelance = result.data?.findIndex(
            (el) => el.statut == 10 || el.statut == 40
          ); //debit interdit et rejeté
          this.canRelance =
            findPrelevToRelance != -1 &&
            findPrelevToRelance != null &&
            findPrelevToRelance != undefined;
        } catch (error) {
          console.log(error);
        }
      });

    this._tableDataService.data$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response) => {
        console.log(
          "details prelevementRemiseData 1111 response=======>",
          response
        );
        let result: any = response;
        try {
          console.log(
            "details prelevementRemiseData 22222 response=======>",
            response
          );
          this.prelevementData = response;
          this.montantTo = response?.montant || 0;
          console.log(
            "details prelevementRemiseData 333 response=======>",
            this.prelevementData
          );
        } catch (error) {
          console.log(error);
        }
      });

    this._traitementPrelevementService.prelevement$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response) => {
        console.log(
          "----------------prelevement$777----------------------------->",
          response
        );
        this.prelevementRemiseData = response?.data;
        try {
          this.montantTotal = this.prelevementRemiseData?.mtTotal || 0;
          this.nomFichier = this.prelevementRemiseData?.nomfichier || "";
        } catch (error) {
          console.log(error);
          this.montantTotal = 0;
        }
        this._changeDetectorRef.detectChanges();
      });

    this._activatedRoute.params.subscribe((params) => {
      this.id = params["id"];
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

  cloturerPrelevement() {
    console.log("traitement prelevement id", this.prelevementData);
    this._traitementPrelevementService
      .cloturerPrelevement(this.id)
      .pipe()
      .subscribe({
        next: (response) => {
          console.log(response);
          this.goBackToList();
        },
        error: (error) => {
          console.error("Error : ", JSON.stringify(error));
          // Set the alert
          this.alert = {
            type: "error",
            message: error.error.message ?? error.error,
          };
          // Show the alert
          this.showAlert = true;
          this._changeDetectorRef.detectChanges();
        },
      });
  }

  telechargerPrelevementValider(): void {
    this._traitementPrelevementService
      .telechargerPrelevementValider(this.id)
      .pipe()
      .subscribe((blob) => {
        // Create a temporary anchor element and trigger the download
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = this.nomFichier + ".rec"; // Set the desired file name
        link.click();
      });
  }
  telechargerRelance(): void {
    this._traitementPrelevementService
      .telechargerRelance(this.id)
      .pipe()
      .subscribe({
        next: (response) => {
          console.log(response);
          this.goBackToList();
        },
        error: (error) => {
          //console.log('Error : ', error.);
          const dataString = new TextDecoder().decode(error.error);
          const data = JSON.parse(dataString);
          console.log("error 123", dataString);
          // Set the alert
          this.alert = { type: "error", message: data.message };
          // Show the alert
          this.showAlert = true;
          this._changeDetectorRef.detectChanges();
        },
      });
  }

  openDetailComponent(component: DetailsComponent) {
    component.matDrawer = this.matDrawer;
    component.formTitle = "PRELEVEMENT";
    component.constructorPayload = Prelevement.constructorPrelevement;
    component.endpoint = "prelevement/admin/modificationEtatPaiement";
    component.loadDataOnInit = false;
    component.canDelete = false;

    //Initialisation formulaire details
    component.formFields = [
      {
        key: "statut",
        libelle: "Etat Paiement",
        type: "select",

        options: [
          {
            value: "60",
            libelle: "Rejeté",
          },
          {
            value: "13",
            libelle: "Reglé",
          },
        ],

        validators: {
          required: true,
        },
      },
    ];
  }
}
