import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  takeUntil,
} from "rxjs";
import { fuseAnimations } from "@fuse/animations";
import { PoidsValidationWorkflow } from "app/modules/admin/poidsValidationWorkflow/poidsValidationWorkflow/poidsValidationWorkflow.types";
import { CompteService } from "app/modules/admin/compte/compte/compte.service";
import { MatDrawer } from "@angular/material/sidenav";
import { ActivatedRoute, Router } from "@angular/router";
import { FuseMediaWatcherService } from "@fuse/services/media-watcher";
import { MatTableDataSource } from "@angular/material/table";
//import { WorkflowDefinition } from '../../workflow.definition';
import { User } from "app/core/user/user.types";
import { UserService } from "app/core/user/user.service";
import { ResponseContrat } from "app/modules/admin/common/contrat/response.type";
import { CreateComponent } from "app/modules/admin/common/create/create/create.component";
import { EntrepriseService } from "app/modules/admin/entreprise/entreprise/entreprise.service";
import { AgenceService } from "app/modules/admin/agence/agence/agence.service";
import { TableDataService } from "app/modules/admin/common/table-data/table-data.services";
import { UtilisateursService } from "app/modules/admin/neoapps/utilisateurs/utilisateurs/utilisateurs.service";

@Component({
  selector: "PoidsValidationWorkflow",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
})
export class ListPoidsValidationWorkflowComponent implements OnInit {
  @ViewChild("matDrawer", { static: true }) matDrawer: MatDrawer;
  drawerMode: "side" | "over";
  pageSize = 100;
  /**DataTable */
  selectedRowIndex: any;
  private _searchTerms = new Subject<string>();
  _filterObject: any = { criteria: "" };

  /**compte */
  _compte: PoidsValidationWorkflow[] = [];
  entreprises: any[];
  agences: any[];

  _nombreUser = 0;
  flashMessage: "success" | "error" | null = null;
  isLoading: boolean = false;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  /**tableau* */

  public dataStructure = [
    {
      key: "emailUtilisateur",
      label: "Email Utilisateur",
    },
    {
      key: "codeWorkflow",
      label: "Code Workflow",
    },

    {
      key: "poids",
      label: "poids de signature",
    },

    {
      key: "dateCreation",
      label: "Date création",
      type: "date",
    },
    {
      key: "dateModification",
      label: "Date modification",
      type: "date",
    },
    {
      key: "statut",
      label: "Etat",
      type: "status",
      statusValues: [
        { value: 1, libelle: "Activé", color: "#68D391" },
        { value: 21, libelle: "Désactivé", color: "#F56565" },
      ],
    },
  ];

  _utilisateurs: any[];
  public displayedColumns: string[] = [
  
    "codeWorkflow",
    "emailUtilisateur",
    "poids",
    "dateCreation",
    "dateModification",
    "statut",
  ];

  /**
   * Constructor
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _activatedRoute: ActivatedRoute,
    private _utilisateurService: UtilisateursService,
    private _tableDataService: TableDataService,
    private _router: Router,
    private _fuseMediaWatcherService: FuseMediaWatcherService
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to MatDrawer opened change
    this.matDrawer.openedChange.subscribe((opened) => {
      if (!opened) {
        // Mark for check
        this._changeDetectorRef.markForCheck();
      }
    });

    this.loadUtilisateurs();

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

    this._searchTerms
      .pipe(
        debounceTime(300), // Adjust the debounce time (in milliseconds) as needed
        distinctUntilChanged(),
        // Ignore if the new term is the same as the previous term
        filter(
          (term: string) => !(term.startsWith("[") && !term.endsWith("]"))
        ), // Filter out undesired terms
        switchMap((term: string) => {
          this._filterObject = { criteria: term };
          this._tableDataService._filterObject = { criteria: term };
          this._tableDataService._hasPagination = true;
          this._tableDataService._paginationObject = {
            page: 0,
            size: 10,
          };
          return this._tableDataService.getDatas();
        })
      )
      .subscribe(() => {
        // Perform any additional actions after the data is retrieved.
        this._changeDetectorRef.detectChanges();
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

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------
  /**
   *
   * @param event
   */
  applyFilter(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this._searchTerms.next(query);
  }

  /**
   * On backdrop clicked
   */
  onBackdropClicked(): void {
    // Go back to the list
    this._router.navigate(["./"], { relativeTo: this._activatedRoute });

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Track by function for ngFor loops
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  loadUtilisateurs() {
    this._utilisateurService.utilisateurs$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          console.log("Response utilisateur===> :", response);
          this._utilisateurs = response.data?.map((el) => {
            return {
              value: el.email,
              libelle: el.email,
            };
          });
          this._changeDetectorRef.markForCheck();
        },
      });
  }

  openCreateComponent(component: CreateComponent) {
    component.matDrawer = this.matDrawer;
    component.endpoint = "poidsValidationWorkflows";
    component.formTitle = "Poids Validation Workflow";
    component.constructorPayload =
      PoidsValidationWorkflow.constructorPoidsValidationWorkflow;
    component.formFields = [
      {
        key: "emailUtilisateur",
        libelle: "Email Utilisateur",
        type: "autocomplete",
        placeholder: "Ex: xxxx@mail.com",
        typeSearch: "utilisateur",

        validators: {
          required: true,
        },
        options: this._utilisateurs,
      },

      {
        key: "codeWorkflow",
        libelle: "Code Workflow",
        type: "select",
        disabled:true,
        options: [
          {
            value: "WORKFLOW_SALAIRE",
            libelle: "WORKFLOW_SALAIRE",
          },
        ],

        validators: {
          required: true,
        },
      },
      {
        key: "poids",
        libelle: "Poids Signature",
        placeholder: "Ex: 1",
        type: "number",
        validators: {
          minValue: 1,
          maxValue: 100,
          required: true,
        },
      },
      {
        key: "statut",
        libelle: "Statut",
        type: "select",
        disabled:true,
        writeInCreate:false,
        options: [{ value: 21, libelle: "Désactivé" }, { value: 1, libelle: "Activé" }],
      },

     
    ];
  }
}
