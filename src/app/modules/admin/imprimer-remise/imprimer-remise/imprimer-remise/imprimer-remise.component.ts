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
  UntypedFormGroup,
  Validators,
  FormGroup,
  FormControl,
} from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import {
  takeUntil,
  debounceTime,
  switchMap,
  map,
  Subject,
  merge,
  Observable,
} from "rxjs";
import { fuseAnimations } from "@fuse/animations";
import { ImprimerRemiseService } from "../imprimer-remise.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDrawer } from "@angular/material/sidenav";
import { FuseAlertType } from "@fuse/components/alert";
import { TableDataService } from "app/modules/admin/common/table-data/table-data.services";
//import {img} from './image';

@Component({
  selector: "app-imprimer-remise",
  templateUrl: "./imprimer-remise.component.html",
  styleUrls: ["imprimer-remise.component.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations,
})
export class ImprimerRemiseComponent implements OnInit, OnDestroy {
  @ViewChild("matDrawer", { static: true }) matDrawer: MatDrawer;
  drawerMode: "side" | "over";
  noData: any;
  remiseData: any;
  listeEntreprise: any[] = [];
  //public selectedValue: string;
  idEntreprise: string = "0";
  montantTotal: number = 0;
  nombreRemise: number = 0;
  alert: { type: FuseAlertType; message: string } = {
    type: "success",
    message: "",
  };
  showAlert: boolean = false;

  public dataStructure = [
    {
      key: "reference",
      label: "reference",
    },

    {
      key: "nbremise",
      label: "Nombre de Remise",
    },
    {
      key: "nbcheque",
      label: "Nombre de Cheque",
    },
    {
      key: "montantTotal",
      label: "Montant Total",
      type: "montant",
    },
    {
      key: "dateExport",
      label: "Date Exportation",
      type: "date",
    },
  ];

  public displayedColumns: string[] = [
    "reference",
    "nbremise",
    "nbcheque",
    "montantTotal",
    "dateExport",
  ];

  isLoading = false;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  selectedRemise: any | null = null;
  selectedRemiseForm: UntypedFormGroup;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  scannerIsConnected = false;

  imprimerForm = new FormGroup({
    identreprise: new FormControl("", Validators.required),
    dateExport: new FormControl("", Validators.required),
  });

  //CYCLE DE VIE
  ngOnInit() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);
    const dateDebut = today.toISOString();
    const dateFin = endOfDay.toISOString();

    this.imprimerForm = this._formBuilder.group({
      dateDebut: [dateDebut, [Validators.required]],
      dateFin: [dateFin, [Validators.required]],
    });

    //getCompteByEntreprise();
    this.loadCompte();
    this.loadEntreprise();
  }
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _formBuilder: UntypedFormBuilder,
    private _remiseService: ImprimerRemiseService,
    private _tableDataService: TableDataService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _imprimerRemiseService: ImprimerRemiseService,
    private _entrepriseService: ImprimerRemiseService
  ) {}

  closeAlert() {
    this.showAlert = false; // Définir showAlert à false pour masquer l'alerte lorsque l'utilisateur clique sur la croix
  }

  onBackdropClicked(): void {
    // Go back to the list
    this._router.navigate(["./"], { relativeTo: this._activatedRoute });

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  loadCompte() {
    this._remiseService.remiseAvalides$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          console.log("Response compteEntreprises ===>", response);
          if (response == null) {
            response = [];
          }

          this.listeEntreprise = response.data;

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

  onSubmit() {
    let dateDebut = new Date(this.imprimerForm.get("dateDebut").value)
      .toISOString()
      .split("T")[0];
    let dateFin = new Date(this.imprimerForm.get("dateFin").value)
      .toISOString()
      .split("T")[0];
    this._tableDataService._filterObject = {
      dateDebut: dateDebut,
      dateFin: dateFin,
    };
    this._tableDataService._endpoint = `exportation`;
    this._tableDataService.getDatas().subscribe();
    this._changeDetectorRef.markForCheck();

    console.log("date debut ===>", dateDebut);
    console.log("date debut ===>", dateFin);
  }

  loadEntreprise() {
    this._entrepriseService.entreprises$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          console.log("===Response Entreprises =============>", response);
          if (response == null) {
            response = [];
          }

          this.listeEntreprise = response.data;

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

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  closeDetails(): void {
    this.selectedRemise = null;
  }
}
