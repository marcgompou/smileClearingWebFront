import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { takeUntil, debounceTime, switchMap, map, Subject, merge, Observable } from 'rxjs';
import { Remise } from '../../remise.type';
import { fuseAnimations } from '@fuse/animations';
import { ImporterRemiseService } from '../importer-remise.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';
import { FuseAlertType } from '@fuse/components/alert';
import { TableDataService } from 'app/modules/admin/common/table-data/table-data.services';
import { MatSelectChange } from '@angular/material/select';
//import {img} from './image';

@Component({
  selector: 'app-importer-remise',
  templateUrl: './importer-remise.component.html',
  styleUrls: ['importer-remise.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations
})


export class ImporterRemiseComponent implements OnInit, OnDestroy {
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  drawerMode: 'side' | 'over';
  noData: any;
  remiseData: any;
  listeEntreprise: any[] = [];
  listeSuperExportateur: any[] = [];
  //public selectedValue: string;
  idEntreprise: string = "0";
  montantTotal: number = 0;
  nombreRemise: number = 0;
  remiseIsInCorrect: boolean = true;
  //listEntreprise: any;


  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;

  // title = 'socketrv';
  // command = 'StartScanner';
  // action = 'CONNECT';
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
      "label": "Référence"
    },

    {
      "key": "nbremise",
      "label": "Nombre de Remise"
    },
    {
      "key": "nbcheque",
      "label": "Nombre de Chèque"
    },
    {
      "key": "montantTotal",
      "label": "Montant Total",
      "type" : "montant"
    },
    {
      "key": "dateExport",
      "label": "Date Exportation",
      "type":"date",
    },
   

  ];

  public displayedColumns: string[] = ['reference', 'nbremise', 'nbcheque', 'montantTotal', 'dateExport'];

  isLoading = false;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  selectedRemise: any | null = null;
  selectedRemiseForm: UntypedFormGroup;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  entrepriseForm = new FormGroup({
    identreprise: new FormControl('', Validators.required),

  })

  

  //CYCLE DE VIE
  ngOnInit() {

    

    //getCompteByEntreprise();
    this.loadCompte();
    this.loadEntreprise();
    this.loadSUperExportateur();
    this._tableDataService.datas$.pipe(takeUntil(this._unsubscribeAll)).subscribe((res:any) => {
      takeUntil(this._unsubscribeAll),
              
      console.log ("res-----------", res.data.length);
      this.dataSource = new MatTableDataSource(res.data);
    
     
    });

    this.entrepriseForm.get('identreprise').setValue('0');

    this._importerRemiseService.superExportateurs$.pipe(takeUntil(this._unsubscribeAll)).subscribe((res:any) => {
      takeUntil(this._unsubscribeAll),
              
      console.log ("res-----------", res.data.length);
      this.dataSource = new MatTableDataSource(res.data);
    
     
    })


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
    private _remiseService: ImporterRemiseService,
    private _tableDataService:TableDataService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _importerRemiseService:ImporterRemiseService,
    private _entrepriseService: ImporterRemiseService,
    private _superExportateurService:ImporterRemiseService ) {
  }



  closeAlert() {
    this.showAlert = false; // Définir showAlert à false pour masquer l'alerte lorsque l'utilisateur clique sur la croix
  }


  updateList(newMatTable: MatTableDataSource<any>) {
    this.dataSource = newMatTable;
    this._changeDetectorRef.markForCheck();
  }

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
        this.listeEntreprise = response.data;
        this._changeDetectorRef.markForCheck();
      },
      error: (error) => {
        console.error('Error : ', JSON.stringify(error));
        // Set the alert
        this.alert = { type: 'error', message: error.error.message ?? error.error };
        // Show the alert
        this.showAlert = true;
        this._changeDetectorRef.markForCheck();
      }
    });
  }
  loadSUperExportateur(){
    this._importerRemiseService.superExportateurs$.pipe(takeUntil(this._unsubscribeAll)).subscribe({
      next:(response : any)=>{
          console.log("Response loadSUperExportateur ===>",response);
          if (response == null) { response = []; }
          this.listeSuperExportateur = response.data;
          this._changeDetectorRef.markForCheck();
      }
    }) 

  }




onSelectChange(event: MatSelectChange) {
this.idEntreprise = event.value?event.value:"0";
  console.log('Valeur sélectionnée :', this.idEntreprise);
  this._tableDataService._endpoint=`exportation/admin?idEntreprise=${this.idEntreprise}`;
  this._tableDataService.getDatasByPath().subscribe();
  
  this._changeDetectorRef.markForCheck();
  // Utilisez selectedValue pour prendre des mesures en conséquence
}
  
  

  onSubmit() {

    //let listRemises: any[] = [];
    
  this._importerRemiseService.importerRemise(this.idEntreprise).pipe(takeUntil(this._unsubscribeAll)).subscribe({
    next:(response)=>{
        console.log(response);
        this._tableDataService._endpoint=`exportation?idEntreprise=${this.idEntreprise}`;
        this._tableDataService.getDatasByPath().subscribe();
        this._superExportateurService.getSuperExportateur().subscribe();
        this._changeDetectorRef.markForCheck();

    } ,
     error: (error) => {
        console.error('Error : ', JSON.stringify(error));
        // Set the alert
        this.alert = { type: 'error', message: error.error.message ?? error.error };
        // Show the alert
        this.showAlert = true;
        this._changeDetectorRef.markForCheck();
      }

  })




  }


  loadEntreprise(){
    this._entrepriseService.entreprises$.pipe(takeUntil(this._unsubscribeAll)
    ).subscribe({
        next: (response:any) => {
          console.log("===Response Entreprises =============>", response);
          if(response==null){response=[];}
          this.listeEntreprise = response.data;
          this._changeDetectorRef.markForCheck();
        }, 
        error: (error) => {
          //not show historique
          //this.showData = false;
          console.error('Error : ',JSON.stringify(error));
          // Set the alert
          this.alert = { type: 'error', message: error.error.message??error.error };
          // Show the alert
          this.showAlert = true;
          this._changeDetectorRef.markForCheck();
        }
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



  toggleDetails(numChq: string): void {
    // If the product is already selected...
    if (this.selectedRemise && this.selectedRemise.numChq === numChq) {
      // Close the details
      this.closeDetails();
      return;
    }




  }
}
