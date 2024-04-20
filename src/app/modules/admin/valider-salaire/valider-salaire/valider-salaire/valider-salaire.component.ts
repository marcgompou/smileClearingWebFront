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
  Validators,
  FormGroup,
  FormControl,
} from "@angular/forms";
import { takeUntil, Subject } from "rxjs";
import { fuseAnimations } from "@fuse/animations";
import { ValiderSalaireService } from "../valider-salaire.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDrawer } from "@angular/material/sidenav";
import { FuseAlertType } from "@fuse/components/alert";
import { MatSelectChange } from "@angular/material/select";
import { TableDataService } from "app/modules/admin/common/table-data/table-data.services";

@Component({
  selector: "app-valider-salaire",
  templateUrl: "./valider-salaire.component.html",
  styleUrls: ["valider-salaire.component.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations,
})
export class ValiderSalaireComponent implements OnInit, OnDestroy {
  @ViewChild("matDrawer", { static: true }) matDrawer: MatDrawer;
  drawerMode: "side" | "over";
  // noData: any;

  listeSalaire: any[] = [];
  montantTotal: number = 0;
  //nombreRemise: number = 0;
  statut: string = "1";

  alert: { type: FuseAlertType; message: string } = {
    type: "success",
    message: "",
  };
  showAlert: boolean = false;

  public dataStructure = [
    {
      key: "nomFichier",
      label: "Nom Fichier",
    },
    {
      key: "nomEntreprise",
      label: "Nom Entreprise",
    },

    {
      key: "codeAgence",
      label: "Code Agence",
    },
    {
      key: "numeroCompte",
      label: "Numero Compte",
    },

    {
      key: "nombreVirement",
      label: "Nombre Virement",
    },
    {
      key: "montantTotal",
      label: "Montant Total",
      type: "montant",
    },
    {
      key: "dateEnregistrement",
      label: "Date Enregistrement",
      type: "date",
    },
    {
      key: "dateEcheance",
      label: "Date Echeance",
      type: "date",
    },

    {
      key: "niveauValidation",
      label: "Niveau Validation",
    },
  ];

  public displayedColumns: string[] = [
    "nomFichier",
    "nomEntreprise",
    "codeAgence",
    "numeroCompte",
    "nombreVirement",
    "montantTotal",
    "dateEnregistrement",
    "dateEcheance",
    "niveauValidation",
  ];

  // sent = [];
  isLoading = false;
  // searchInputControl: UntypedFormControl = new UntypedFormControl();
  //selectedRemise: any | null = null;
  //selectedRemiseForm: UntypedFormGroup;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  // remises$: Observable<Remise[]>;
  _salaireList: any[] = [];

  salaireForm = new FormGroup({
    statut: new FormControl("", Validators.required),
  });

  //CYCLE DE VIE
  ngOnInit() {
    this._tableDataService.datas$.subscribe((res: any) => {
      this._salaireList = res.data as any[];
      //    this.dataSource = new MatTableDataSource(res.data);
      console.log("this._salaireList------", this._salaireList);
      if (
        this._salaireList !== undefined &&
        this._salaireList !== null &&
        this._salaireList?.length > 0
      ) {
        this.montantTotal = this._salaireList.reduce(
          (a, b) => a + b?.montantTotal,
          0
        );
      }
    });
    this.salaireForm = this._formBuilder.group({
      statut: "1",
    });
  }
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _formBuilder: UntypedFormBuilder,
    private _salaireService: ValiderSalaireService,
    private _activatedRoute: ActivatedRoute,
    private _tableDataService: TableDataService,
    private _router: Router,
    private _validerSalaireService: ValiderSalaireService
  ) {}

  closeAlert() {
    this.showAlert = false; // Définir showAlert à false pour masquer l'alerte lorsque l'utilisateur clique sur la croix
  }
  loadCompte() {
    this._salaireService.salaireAvalides$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          console.log("Response compteEntreprises ===>", response);
          if (response == null) {
            response = [];
          }

          this.listeSalaire = response.data;

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
    this.statut = event.value ? event.value : "1";
    console.log("Valeur sélectionnée :", this.statut);
    this._tableDataService._endpoint = `salaires?statut=${this.statut}`;
    this._tableDataService.getDatasByPath().subscribe();
    this._changeDetectorRef.markForCheck();
    // Utilisez selectedValue pour prendre des mesures en conséquence
  }

  onSubmit() {}

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
