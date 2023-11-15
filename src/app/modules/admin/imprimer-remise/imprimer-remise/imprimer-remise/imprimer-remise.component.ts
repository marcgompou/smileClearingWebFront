import {  ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { takeUntil, debounceTime, switchMap, map, Subject, merge, Observable } from 'rxjs';
import { Remise } from '../../remise.type';
import { fuseAnimations } from '@fuse/animations';
import { ImprimerRemiseService } from '../imprimer-remise.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';
import { FuseAlertType } from '@fuse/components/alert';
import { TableDataService } from 'app/modules/admin/common/table-data/table-data.services';
import { MatSelectChange } from '@angular/material/select';
//import {img} from './image';

@Component({
  selector: 'app-imprimer-remise',
  templateUrl: './imprimer-remise.component.html',
  styleUrls: ['imprimer-remise.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations
})


export class ImprimerRemiseComponent implements OnInit, OnDestroy {
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  drawerMode: 'side' | 'over';
  noData: any;
  remiseData: any;
  listeEntreprise: any[] = [];
  //public selectedValue: string;
  idEntreprise: string = "0";
  montantTotal: number = 0;
  nombreRemise: number = 0;







  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  showAlert: boolean = false;

  public dataStructure = [

    {
      "key": "reference",
      "label": "reference"
    },

    {
      "key": "nbremise",
      "label": "Nombre de Remise"
    },
    {
      "key": "nbcheque",
      "label": "Nombre de Cheque"
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
  scannerIsConnected = false;


  imprimerForm = new FormGroup({
    
    identreprise: new FormControl('', Validators.required),
    dateExport: new FormControl('', Validators.required),


  })

  

  //CYCLE DE VIE
  ngOnInit() {

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);
    const dateDebut = today.toISOString();
    const dateFin = endOfDay.toISOString();

    this.imprimerForm = this._formBuilder.group({
        dateDebut: [dateDebut,[Validators.required]],
        dateFin: [dateFin,[Validators.required]],
      });

    //getCompteByEntreprise();
    this.loadCompte();
    this.loadEntreprise();

    // Subscribe to search input field value changes
    // this.searchInputControl.valueChanges
    //   .pipe(
    //     takeUntil(this._unsubscribeAll),
    //     debounceTime(300),
    //     switchMap((query) => {
    //       this.isLoading = true;
    //       //TODO RETURN CORRECT VALUE
    //       return null;
    //       //   return this._inventoryService.getProducts(0, 10, 'name', 'asc', query);
    //     }),
    //     map(() => {
    //       this.isLoading = false;
    //     })
    //   )
    //   .subscribe();

    

  }
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _formBuilder: UntypedFormBuilder,
    private _remiseService: ImprimerRemiseService,
    private _tableDataService:TableDataService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _imprimerRemiseService:ImprimerRemiseService,
    private _entrepriseService: ImprimerRemiseService,


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


  

  

  onSubmit() {

    //let listRemises: any[] = [];
    
  this._imprimerRemiseService.getRemiseImprimer(this.idEntreprise).pipe(takeUntil(this._unsubscribeAll)).subscribe({
    next:(response)=>{
        console.log(response);
        this._tableDataService._endpoint=`exportation?idEntreprise=${this.idEntreprise}`;
        this._tableDataService.getDatasByPath().subscribe();
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



}
