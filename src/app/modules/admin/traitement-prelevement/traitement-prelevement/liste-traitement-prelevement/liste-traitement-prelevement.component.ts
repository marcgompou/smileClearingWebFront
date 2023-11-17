import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { takeUntil, debounceTime, switchMap, map, Subject, merge, Observable } from 'rxjs';
import { Prelevement } from '../../prelevement.type';
import { fuseAnimations } from '@fuse/animations';
import { TraitementPrelevementService } from '../traitement-prelevement.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';
import { FuseAlertType } from '@fuse/components/alert';
import { MatSelectChange } from '@angular/material/select';
import { TableDataService } from 'app/modules/admin/common/table-data/table-data.services';
//import {img} from './image';

@Component({
  selector: 'app-liste-traitement-prelevement',
  templateUrl: './liste-traitement-prelevement.component.html',
  styleUrls: ['liste-traitement-prelevement.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations
})


export class ListeTraitementPrelevementComponent implements OnInit, OnDestroy {
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  drawerMode: 'side' | 'over';
  listeCompteEntreprise: any[] = [];
  statut: string = "0";
  totalRows = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 25];

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  showAlert: boolean = false;

  public dataStructure = [



    {
      "key": "codeEmetteur",
      "label": "Code emetteur"
    },
    {
      "key": "nomfichier",
      "label": "Nom fichier"
    },

    {
      "key": "codeagence",
      "label": "Code agence"
    },
    {
      "key": "compteCredite",
      "label": "Compte crédite"
    },
    {
      "key": "nbPrelevement",
      "label": "Nombre prelevement"

    },
    {
      "key": "mtTotal",
      "label": "Montant total"

    },
    {
      "key": "dateEdition",
      "label": "Date edition",
      "type": "date"
    },

    {
      "key": "dateEngistrement",
      "label": "Date engistrement",
      "type": "date"
    },


  ];

  public displayedColumns: string[] = ['codeEmetteur', 'nomfichier', 'codeagence', 'compteCredite', 'nbPrelevement', 'mtTotal', 'dateEdition', 'dateEngistrement'];

  sent = [];
  isLoading = false;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  selectedRemise: any | null = null;
  selectedRemiseForm: UntypedFormGroup;
  private _unsubscribeAll: Subject<any> = new Subject<any>();


  compteClientForm = new FormGroup({
    statut: new FormControl('', Validators.required),

  })





  //CYCLE DE VIE
  ngOnInit() {


    // Subscribe to search input field value changes
    this.searchInputControl.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(300),
        switchMap((query) => {
          // this.closeDetails();
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
      statut: ['3']
    });

  }
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _formBuilder: UntypedFormBuilder,
    private _prelevementService: TraitementPrelevementService,
    private _activatedRoute: ActivatedRoute,
    private _tableDataService: TableDataService,
    private _router: Router,
    private _traitementPrelevementService: TraitementPrelevementService,


  ) {



  }



  closeAlert() {
    this.showAlert = false; // Définir showAlert à false pour masquer l'alerte lorsque l'utilisateur clique sur la croix
  }
 

  
  onBackdropClicked(): void {
    // Go back to the list
    this._router.navigate(['./'], { relativeTo: this._activatedRoute });

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }


  

  //recherche les prelevement selon le statut
  onSelectChange(event: MatSelectChange) {
    this.statut = event.value ? event.value : "0";
    console.log('Valeur sélectionnée :', this.statut);
    this._tableDataService._endpoint = `prelevement?statut=${this.statut}`;
    this._tableDataService.getDatasByPath().subscribe();
    this._changeDetectorRef.markForCheck();
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
