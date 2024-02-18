import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators, FormGroup, FormControl, NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { takeUntil, debounceTime, switchMap, map, Subject, merge, Observable } from 'rxjs';
//import { Transaction } from '../../transaction.type';
import { fuseAnimations } from '@fuse/animations';
import { TransactionService } from '../transaction-bancaire.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';
import { FuseAlertType } from '@fuse/components/alert';
import { MatSelectChange } from '@angular/material/select';
import { TableDataService } from 'app/modules/admin/common/table-data/table-data.services';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Moment } from 'moment';
//import {img} from './image';

@Component({
  selector: 'app-transaction-bancaire',
  templateUrl: './transaction-bancaire.component.html',
  styleUrls: ['transaction-bancaire.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations
})


export class TransactionComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  drawerMode: 'side' | 'over';
  // noData: any;
  remiseData: any;
  listeCompteEntreprise: any[] = [];
  solde: number = 0;
  //nombreRemise: number = 0;
  statut: string = "0";
  _filterObject:any={criteria:""}


  dateDebut="";
  dateFin="";
  compte="0"

  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;
  @ViewChild('formNgForm') formNgForm: NgForm;
  form: FormGroup = new FormGroup({})


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
      "label": "Nom fichier"
    },

    {
      "key": "montantAs",
      "label": "Solde Veille"
    },
    {
      "key": "montantNs",
      "label": "Nouveau Solde"
    },
    {
      "key": "dateAs",
      "label": "Date Comptable veille",
      "type": "date"
    },
    {
      "key": "dateNs",
      "label": "Date Comptable",
      "type": "date"
    },
    {
      "key": "dateEnregistrement",
      "label": "Date Enregistrement",
      "type": "date"
    },
    {
      "key": "numeroCompte",
      "label": "numeroCompte",

    },


  ];

  public displayedColumns: string[] = this.dataStructure.map((col) => col.key);

  // isLoading = false;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  //Date minimum et date maximum pour la recherche
  minDate: Date;
  maxDate: Date;


  //CYCLE DE VIE
  
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _formBuilder: UntypedFormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _tableDataService:TableDataService,
    private _router: Router,
    private _transactionService:TransactionService
  ) {
    const today = new Date();
    this.maxDate = new Date(); // Aujourd'hui
    // Pour minDate, soustrayez 3 mois de la date actuelle


  }





  ngOnInit() {

    
    this._tableDataService.datas$.subscribe((res:any) => {
      console.log("===========>", res.data);
      this.dataSource = new MatTableDataSource(res.data);
    });
    this.form = this._formBuilder.group({
      dateDebut: [new Date().toISOString().split('T')[0], [Validators.required]],
      dateFin: [new Date().toISOString().split('T')[0], [Validators.required]],
      compte:['1', [Validators.required]],
    });
    this.loadCompte();
  
  }

  onSubmit(){

    this.dateDebut = new Date(this.form.get('dateDebut').value).toISOString().split('T')[0];
    this.dateFin = new Date(this.form.get('dateFin').value).toISOString().split('T')[0];
    this.compte=this.form.get('compte').value;

    console.log("dateDebut:", this.dateDebut);
    console.log("dateFin:",this.dateFin);

    console.log("compte:",this.form.get('compte').value);

    this._filterObject={ 
      compte:this.form.get('compte').value,
      dateDebut:this.dateDebut,
      dateFin:this.dateFin,
    };

    this.filtering();

    this._tableDataService.getDatas().subscribe();


  }

  filtering(): void {
    this._tableDataService._endpoint = `detailsCompteAfb120`;
    this._tableDataService._filterObject = this._filterObject
    this._tableDataService._hasPagination = true;
    this._tableDataService._paginationObject = {
      page: 0,
      size: 10
    };
  }


  closeAlert() {
    this.showAlert = false; // Définir showAlert à false pour masquer l'alerte lorsque l'utilisateur clique sur la croix
  }
  


  addEvent(type: string, event: MatDatepickerInputEvent<Moment>) {
     console.log(`${type}: ${event.value}`);
     var date = event.value;
     console.log(date)
     if (type === 'dateDebutChange' && date) {
       // Définir la date maximale pour la date de fin
       const newMaxDate = new Date(date.year(), date.month() + 3, date.date());
        //Si la date de fin est supérieure à aujourd'hui alors elle est definie sur aujord'hui
       this.maxDate=newMaxDate>new Date()?new Date():newMaxDate;
     }
  
  
  }
  // updateList(newMatTable: MatTableDataSource<any>) {
  //   this.dataSource = newMatTable;
  //   this._changeDetectorRef.markForCheck();
  // }

  // getColumnHeaderText(column: string): string {

  //   //  console.log("column===>",column)
  //   let found = this.dataStructure.find(e => e.key == column);
  //   return found ? found.label : "";

  // }

  onBackdropClicked(): void {
    // Go back to the list
    this._router.navigate(['./'], { relativeTo: this._activatedRoute });

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }


  loadCompte() {
    this._transactionService.compteEntreprises$.pipe(takeUntil(this._unsubscribeAll)
    ).subscribe({
      next: (response: any) => {
        console.log("Response compteEntreprises ===>", response);
        if (response == null || response?.data == undefined || response?.data?.length == 0) {
          
          let respDefault:any={
            data:[]
          }
          respDefault.data[0]={
            compte:"0",
            designation:"Aucun compte disponible"
          }
          response = respDefault;
        
        }

        this.listeCompteEntreprise = response.data;
        this.form.get('compte').setValue(response.data[0].compte);

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
    // if (this._sort && this._paginator) {
    //   // Set the initial sort
    //   this._sort.sort({
    //     id: 'name',
    //     start: 'asc',
    //     disableClear: true
    //   });

    //   // Mark for check
    //   this._changeDetectorRef.markForCheck();

    //   // If the user changes the sort order...
    //   this._sort.sortChange
    //     .pipe(takeUntil(this._unsubscribeAll))
    //     .subscribe(() => {
    //       this._paginator.pageIndex = 0;
    //       // Close the details
    //      // this.closeDetails();
    //     });

    //   merge(this._sort.sortChange, this._paginator.page).pipe(
    //     switchMap(() => {
    //      // this.closeDetails();
    //       this.isLoading = true;
    //       return null;
    //     }),
    //     map(() => {
    //       this.isLoading = false;
    //     })
    //   ).subscribe();
    // }
  }

  onSelectChange(event: MatSelectChange) {
    this.compte = event.value?event.value:"0";
      this._filterObject={
        compte:this.compte
      }
      this.filtering();
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

 





  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }













  
}
