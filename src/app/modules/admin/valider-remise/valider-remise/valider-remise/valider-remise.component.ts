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
import { takeUntil, debounceTime, switchMap, map, Subject } from "rxjs";
import { fuseAnimations } from "@fuse/animations";
import { ValiderRemiseService } from "../valider-remise.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MatTableDataSource } from "@angular/material/table";
import { FuseAlertType } from "@fuse/components/alert";
import { MatSelectChange } from "@angular/material/select";
import { TableDataService } from "app/modules/admin/common/table-data/table-data.services";
//import {img} from './image';

@Component({
  selector: "app-valider-remise",
  templateUrl: "./valider-remise.component.html",
  styleUrls: ["valider-remise.component.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations,
})
export class ValiderRemiseComponent implements OnInit, OnDestroy {
  drawerMode: "side" | "over";
  // noData: any;
  remiseData: any;
  listeCompteEntreprise: any[] = [];
  montantTotal: number = 0;
  nombreRemise: number = 0;
  statut: string = "0";
  remiseIsInCorrect: boolean = true;

  totalRows = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 25];

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  alert: { type: FuseAlertType; message: string } = {
    type: "success",
    message: "",
  };
  showAlert: boolean = false;

  public dataStructure = [
    {
      key: "reference",
      label: "Reference",
    },

    {
      key: "dateCreation",
      label: "Date de creation",
      type: "date",
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
  public _filterObject: { statut: string };
  isLoading = false;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  selectedRemise: any | null = null;
  selectedRemiseForm: UntypedFormGroup;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  // remises$: Observable<Remise[]>;
  scannerIsConnected = false;

  compteClientForm = new FormGroup({
    statut: new FormControl("", Validators.required),
  });

  //CYCLE DE VIE
  ngOnInit() {
    this._tableDataService.datas$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res: any) => {
        takeUntil(this._unsubscribeAll);
        console.log("res-----------", res.data.length);
        this.dataSource = new MatTableDataSource(res.data);
      });
    //getCompteByEntreprise();
    //  this.loadCompte();

    // Subscribe to search input field value changes
    this.searchInputControl.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(300),
        switchMap((query) => {
          this.closeDetails();
          this.isLoading = true;
          //TODO RETURN CORRECT VALUE
          return null;
          //   return this._inventoryService.getProducts(0, 10, 'name', 'asc', query);
        }),
        map(() => {
          this.isLoading = false;
        })
      )
      .subscribe();

    this.compteClientForm = this._formBuilder.group({
      statut: ["1"],
      //mySelect: ['option2'] // Set the default value here
    });
  }
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _formBuilder: UntypedFormBuilder,
    private _remiseService: ValiderRemiseService,
    private _activatedRoute: ActivatedRoute,
    private _tableDataService: TableDataService,
    private _router: Router,
    private _validerRemiseService: ValiderRemiseService
  ) {}

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

  onSelectChange(event: MatSelectChange) {
     this.statut = event.value ? event.value : "0";
     console.log("Valeur sélectionnée :", this.statut);
     this._filterObject = { statut: this.statut };
     this.onFilterChange(this._filterObject); //On transmet la nouvelle valeur du filtre
     this._changeDetectorRef.markForCheck();
     // Utilisez selectedValue pour prendre des mesures en conséquence


    // this.statut = event.value ? event.value : "0";
    // console.log("Valeur sélectionnée :", this.statut);
    // this._tableDataService._endpoint = `remise?statut=${this.statut}`;
    // this._tableDataService.getDatasByPath().subscribe();
    // this._changeDetectorRef.markForCheck();
    // // Utilisez selectedValue pour prendre des mesures en conséquence
  }

  onSubmit() {
    this._validerRemiseService
      .exporterRemise()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response) => {
          console.log(response);
          this._tableDataService._endpoint = `remise/entreprise?statut=${this.statut}`;
          this._tableDataService
            .getDatasByPath()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe();
          this._changeDetectorRef.markForCheck();
          this.alert = { type: "success", message: response.message };
          this.showAlert = true;
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

  onFilterChange(newFilter: any) {
    // Réagir aux changements de filtre
    console.log("Le filtre a changé dans le composant enfant : ", newFilter);
  }
}
