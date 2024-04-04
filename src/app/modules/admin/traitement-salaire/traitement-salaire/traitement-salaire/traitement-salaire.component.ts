import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { takeUntil, debounceTime, switchMap, map, Subject, merge, Observable } from 'rxjs';
import { Salaire } from '../../salaire.type';
import { fuseAnimations } from '@fuse/animations';
import { TraitementSalaireService } from '../traitement-salaire.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';
import { FuseAlertType } from '@fuse/components/alert';
import { MatSelectChange } from '@angular/material/select';
import { TableDataService } from 'app/modules/admin/common/table-data/table-data.services';
//import {img} from './image';

@Component({
  selector: 'app-traitement-salaire',
  templateUrl: './traitement-salaire.component.html',
  styleUrls: ['traitement-salaire.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations
})


export class TraitementSalaireComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  drawerMode: 'side' | 'over';
  // noData: any;
  remiseData: any;
  listeCompteEntreprise: any[] = [];
  montantTotal: number = 0;
  //nombreRemise: number = 0;
  statut: string = "1";

  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;


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
      "key": "nomFichier",
      "label": "Nom Fichier"
    },
    {
      "key": "nomEntreprise",
      "label": "Nom Entreprise"
    },

   
    {
      "key": "codeAgence",
      "label": "Code Agence"
    },
    {
      "key": "numeroCompte",
      "label": "Numero Compte"

    },
    
    {
      "key": "nombreVirement",
      "label": "Nombre Virement"

    },
    {
      "key": "montantTotal",
      "label": "Montant Total",
      "type": "montant"
    },
    {
      "key": "dateEnregistrement",
      "label": "Date Enregistrement",
      "type": "date"
    },
    {
      "key": "dateEcheance",
      "label": "Date Echeance",
      "type": "date"
    },

    {
      "key": "niveauValidation",
      "label": "Niveau Validation",
     
    },

    

  ];

  public displayedColumns: string[] = ['nomFichier', 'nomEntreprise', 'codeAgence', 'numeroCompte', 'nombreVirement', 'montantTotal','dateEnregistrement', 'dateEcheance','niveauValidation'];

  sent = [];
  isLoading = false;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  selectedRemise: any | null = null;
  selectedRemiseForm: UntypedFormGroup;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  // remises$: Observable<Remise[]>;
  _salaireList:any[]=[];

  salaireForm = new FormGroup({
    statut: new FormControl('', Validators.required),

  })

 



  //CYCLE DE VIE
  ngOnInit() {
   

   
    
    this._tableDataService.datas$.subscribe((res:any) => {
      this._salaireList=res.data as any[];
      this.dataSource = new MatTableDataSource(res.data);

if (this._salaireList !== undefined && this._salaireList !== null) {
  this.montantTotal=this._salaireList.reduce((a, b) => a + b?.montantTotal, 0);
}

     

    });
    //getCompteByEntreprise();
    this.loadCompte();
   

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

      this.salaireForm = this._formBuilder.group({
        statut: '1'
        //mySelect: ['option2'] // Set the default value here
      });
      console.log("statut----------------",this.statut);

  }
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _formBuilder: UntypedFormBuilder,
    private _salaireService: TraitementSalaireService,
    private _activatedRoute: ActivatedRoute,
    private _tableDataService:TableDataService,
    private _router: Router,
    private _traitementSalaireService:TraitementSalaireService,


  ) {



  }



  closeAlert() {
    this.showAlert = false; // Définir showAlert à false pour masquer l'alerte lorsque l'utilisateur clique sur la croix
  }
  selectedRow(row) {

    const index = this.dataSource.data.indexOf(row);
    this._router.navigate(['./details', index], { relativeTo: this._activatedRoute });
    this._changeDetectorRef.markForCheck();
    this.remiseData = row;


  }

  updateList(newMatTable: MatTableDataSource<any>) {
    this.dataSource = newMatTable;
    this._changeDetectorRef.markForCheck();
  }

  getColumnHeaderText(column: string): string {

    //  console.log("column===>",column)
    let found = this.dataStructure.find(e => e.key == column);
    return found ? found.label : "";

  }

  onBackdropClicked(): void {
    // Go back to the list
    this._router.navigate(['./'], { relativeTo: this._activatedRoute });

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }


  loadCompte() {
    this._salaireService.salaireAvalides$.pipe(takeUntil(this._unsubscribeAll)
    ).subscribe({
      next: (response: any) => {
        console.log("Response compteEntreprises ===>", response);
        if (response == null) { response = []; }

        this.listeCompteEntreprise = response.data;

        this._changeDetectorRef.markForCheck();
      },
      error: (error) => {
        //not show historique
        //this.showData = false;
        console.error('Error : ', JSON.stringify(error));
        // Set the alert
        this.alert = { type: 'error', message: error.error.message ?? error.error };
        // Show the alert
        this.showAlert = true;

        this._changeDetectorRef.markForCheck();
      }
    });

  }

 
  /**
     * After view init
     */
  ngAfterViewInit(): void {
    if (this._sort && this._paginator) {
      // Set the initial sort
      this._sort.sort({
        id: 'name',
        start: 'asc',
        disableClear: true
      });

      // Mark for check
      this._changeDetectorRef.markForCheck();

      // If the user changes the sort order...
      this._sort.sortChange
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(() => {
          // Reset back to the first page
          this._paginator.pageIndex = 0;

          // Close the details
          this.closeDetails();
        });

      // Get products if sort or page changes
      merge(this._sort.sortChange, this._paginator.page).pipe(
        switchMap(() => {
          this.closeDetails();
          this.isLoading = true;
          // return this._inventoryService.getProducts(this._paginator.pageIndex, this._paginator.pageSize, this._sort.active, this._sort.direction);
          //TODO RETURN CORRECT VALUE
          return null;
        }),
        map(() => {
          this.isLoading = false;
        })
      ).subscribe();
    }
  }

  onSelectChange(event: MatSelectChange) {
    this.statut = event.value?event.value:"1";
      console.log('Valeur sélectionnée :', this.statut);
      this._tableDataService._endpoint=`salaires?statut=${this.statut}`;
      this._tableDataService.getDatasByPath().subscribe();
      this._changeDetectorRef.markForCheck();
      // Utilisez selectedValue pour prendre des mesures en conséquence
    }



  onSubmit() {

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



  toggleDetails(numChq: string): void {
    // If the product is already selected...
    if (this.selectedRemise && this.selectedRemise.numChq === numChq) {
      // Close the details
      this.closeDetails();
      return;
    }




  }
}
