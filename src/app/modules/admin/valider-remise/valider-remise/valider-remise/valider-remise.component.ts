import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { takeUntil, debounceTime, switchMap, map, Subject, merge, Observable } from 'rxjs';
import { Remise } from '../../remise.type';
import { fuseAnimations } from '@fuse/animations';
import { ValiderRemiseService } from '../valider-remise.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';
import { FuseAlertType } from '@fuse/components/alert';
import { MatSelectChange } from '@angular/material/select';
import { TableDataService } from 'app/modules/admin/common/table-data/table-data.services';
//import {img} from './image';

@Component({
  selector: 'app-valider-remise',
  templateUrl: './valider-remise.component.html',
  styleUrls: ['valider-remise.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations
})


export class ValiderRemiseComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  drawerMode: 'side' | 'over';
  // noData: any;
  remiseData: any;
  listeCompteEntreprise: any[] = [];
  montantTotal: number = 0;
  nombreRemise: number = 0;
  statut: string = "0";
  remiseIsInCorrect: boolean = true;
  //listeCompteEntreprise: any;
  enregistrerRemise() {
    throw new Error('Method not implemented.');
  }
  selectedProject: string = 'ACME Corp. Backend App';

  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;

  title = 'socketrv';
  command = 'StartScanner';
  action = 'CONNECT';
  received: Remise[] = [];
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
      "key": "reference",
      "label": "Reference"
    },

    {
      "key": "dateCreation",
      "label": "Date de creation"
    },
    {
      "key": "numCompte",
      "label": "Numero de compte"
    },
    {
      "key": "nbCheques",
      "label": "Nombre de Cheque"
    },
    {
      "key": "mtTotal",
      "label": "Montant Total"

    },
   

  ];

  public displayedColumns: string[] = ['reference', 'dateCreation', 'numCompte', 'nbCheques', 'mtTotal'];

  sent = [];
  isLoading = false;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  selectedRemise: any | null = null;
  selectedRemiseForm: UntypedFormGroup;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  // remises$: Observable<Remise[]>;
  scannerIsConnected = false;


  compteClientForm = new FormGroup({
    statut: new FormControl('', Validators.required),

  })

 



  //CYCLE DE VIE
  ngOnInit() {

    
this._tableDataService.datas$.subscribe((res:any) => {
  console.log ("res-----------", res.data.length);
  this.dataSource = new MatTableDataSource(res.data);
 
})
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

    

  }
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _formBuilder: UntypedFormBuilder,
    private _remiseService: ValiderRemiseService,
    private _activatedRoute: ActivatedRoute,
    private _tableDataService:TableDataService,
    private _router: Router,
    private _validerRemiseService:ValiderRemiseService,


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

  // openDetailComponent(component: DetailsRemiseComponent) {

  //   component.matDrawer = this.matDrawer;
  //   component.formTitle = "CHEQUE";
  //   //component.chequeData = this.remiseData;
  //   //Initialisation formulaire details
  //   component.formFields = [
  //     {
  //       key: "id",
  //       libelle: "Identifiant de Remise",
  //       validators: {
  //         min: 7,
  //         max: 7,
  //         required: true
  //       }
  //     },
  //     {
  //       key: "codeBanque",
  //       libelle: "Code Banque",
  //       placeholder: "Ex: CI131",
  //       validators: {
  //         min: 5,
  //         max: 5,
  //         required: true,
  //       }
  //     },
  //     {
  //       key: "codeAgence",
  //       libelle: "Code Agence",
  //       placeholder: "Ex: 01001",
  //       validators: {
  //         min: 5,
  //         max: 5,
  //         required: true
  //       }
  //     },

  //     {
  //       key: "compte",
  //       libelle: "Compte",
  //       validators: {
  //         min: 12,
  //         max: 12,
  //         required: true
  //       }
  //     },
  //     {
  //       key: "cleRib",
  //       libelle: "Cle Rib",
  //       validators: {
  //         min: 2,
  //         max: 50,
  //         required: true
  //       }

  //     },
  //     {
  //       key: "montant",
  //       libelle: "Montant",
  //       type: "number",
  //       validators: {
  //         minValue: 1000,
  //         min: 1,
  //         max: 11,
  //         required: true
  //       }

  //     },
  //     {
  //       key: "tire",
  //       libelle: "Titulaire",
  //       validators: {
  //         max: 50
  //       }
  //     }
  //   ]
  // }
  onBackdropClicked(): void {
    // Go back to the list
    this._router.navigate(['./'], { relativeTo: this._activatedRoute });

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }


  loadCompte() {
    this._remiseService.remiseAvalides$.pipe(takeUntil(this._unsubscribeAll)
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
    this.statut = event.value?event.value:"0";
      console.log('Valeur sélectionnée :', this.statut);
      this._tableDataService._endpoint=`remise/entreprise?statut=${this.statut}`;
      this._tableDataService.getDatasByPath().subscribe();
      this._changeDetectorRef.markForCheck();
      // Utilisez selectedValue pour prendre des mesures en conséquence
    }


    // this._importerRemiseService.importerRemise(this.idEntreprise).pipe(takeUntil(this._unsubscribeAll)).subscribe({
    //   next:(response)=>{
    //       console.log(response);
    //       this._tableDataService._endpoint=`exportation?idEntreprise=${this.idEntreprise}`;
    //       this._tableDataService.getDatasByPath().subscribe();
    //       this._changeDetectorRef.markForCheck();
  
    //   } 
    // })
  //   return this._httpClient.get<any>(`${environment.apiUrl}/remise/entreprise?statut=1`).pipe(
  //     tap((response) => {
  //       console.log('test======================================');
  //       console.log(response);
  //         this._remiseAvalides.next(response);
  //     })
  // );

  onSubmit() {

    //let listRemises: any[] = [];
    
  this._validerRemiseService.exporterRemise().pipe(takeUntil(this._unsubscribeAll)).subscribe({

    next:(response)=>{
      console.log(response);
      this._tableDataService._endpoint=`remise/entreprise?statut=${this.statut}`;
      this._tableDataService.getDatasByPath().subscribe();
      this._changeDetectorRef.markForCheck();
      this.alert = { type: 'success', message: response.message };
      this.showAlert = true;
  } ,
  error: (error) => {
    console.error('Error : ', JSON.stringify(error));
    this.alert = { type: 'error', message: error.error.message??error.message };
    this.showAlert = true;
    this._changeDetectorRef.detectChanges();
  }
  
}
    )


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
