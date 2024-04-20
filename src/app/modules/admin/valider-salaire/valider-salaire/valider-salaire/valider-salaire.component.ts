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

  listeSalaire: any[] = [];
  montantTotal: number = 0;
  statut: string = "1";
  _filterObject:any={};
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

  isLoading = false;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  _salaireList: any[] = [];

  salaireForm = new FormGroup({
    statut: new FormControl("", Validators.required),
  });

  //CYCLE DE VIE
  ngOnInit() {
    this._tableDataService.datas$.subscribe((res: any) => {
      this._salaireList = res.data as any[];
      if (
        this._salaireList !== undefined &&
        this._salaireList !== null &&
        this._salaireList?.length > 0
      ) {
        this.montantTotal = this._salaireList.reduce(
          (a, b) => a + b?.montantTotal,0 );
      }
    });
    this.salaireForm = this._formBuilder.group({
      statut: "1",
    });
  }


  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _tableDataService: TableDataService) {

  }

  onSelectChange(event: MatSelectChange) {
    this.statut = event.value ? event.value : "1";
    console.log("Valeur sélectionnée :", this.statut);
    this._filterObject = { statut: this.statut };
    this.onFilterChange(this._filterObject); //On transmet la nouvelle valeur du filtre
  }



  onFilterChange(newFilter: any) {
    console.log("Le filtre a changé dans le composant enfant : ", newFilter);
  }
  
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
