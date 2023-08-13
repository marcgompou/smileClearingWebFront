import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { WebsocketService } from 'app/core/websocket/websocket.service';
import { takeUntil, debounceTime, switchMap, map, Subject, merge, Observable } from 'rxjs';
import { Cheque } from '../../cheque.type';
import { fuseAnimations } from '@fuse/animations';
import { CreerRemiseService } from '../remise.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';
import { DetailsChequeComponent } from '../details-cheque/details-cheque.component';
import { FuseAlertType } from '@fuse/components/alert';
import {img} from './image';

@Component({
  selector: 'app-creer-remise',
  templateUrl: './creer-remise.component.html',
  styleUrls: ['./creer-remise.component.scss'],
  providers: [WebsocketService],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations
})


export class CreerRemiseComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  drawerMode: 'side' | 'over';
  noData: any;
  chequeData: any;
  listeCompteEntreprise: any[] = [];
  montantTotal:number=0;
  nombreCheque:number=0;
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
  received: Cheque[] = [];
  totalRows = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 25];

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  showAlert: boolean = false;

  public dataStructure = [

    {
      "key": "numChq",
      "label": "Numero  de Cheque"
    },

    {
      "key": "codeBanque",
      "label": "Code Banque"
    },
    {
      "key": "codeAgence",
      "label": "Code Agence"
    },
    {
      "key": "compte",
      "label": "Numero de Compte"
    },
    {
      "key": "cleRib",
      "label": "Cle Rib"

    },
    {
      "key": "montant",
      "label": "Montant"
    },

    {
      "key": "tire",
      "label": "Titulaire"
    }

  ];

  public displayedColumns: string[] = ['numChq', 'codeBanque', 'codeAgence', 'compte', 'cleRib', 'montant', 'tire'];

  sent = [];
  isLoading = false;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  selectedCheque: any | null = null;
  selectedChequeForm: UntypedFormGroup;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  // cheques$: Observable<Cheque[]>;
  scannerIsConnected = false;


  compteClientForm = new FormGroup({
    idCompteClient: new FormControl('', Validators.required),

  })


  //CYCLE DE VIE
  ngOnInit() {

    this.selectedChequeForm = this._formBuilder.group({
      numChq: [''],
      codeBanque: [''],
      codeAgence: ['', [Validators.required]],
      compte: [''],
      cleRib: [[]],
      montant: [''],
      tire: ['']
      // thumbnail        : [''],
      // images           : [[]],
      // currentImageIndex: [0], // Image index that is currently being viewed
    });
  
    //getCompteByEntreprise();
    this.loadCompte();
    this._websocketService.messages.next({ command: this.command, action: this.action, result: "" });
    

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

    this._chequeService.remise$.pipe(takeUntil(this._unsubscribeAll)
    ).subscribe({
      next: (table) => {
        console.log("-------table------", table);
        if(table!=null){
          this.montantTotal=table.reduce((total, obj) => total + obj.montant, 0);
          this.nombreCheque=table.length;
        }else{

          this.montantTotal=0;
          this.nombreCheque=0
          table=[]
        }
        
        this.dataSource = new MatTableDataSource(table);

        this._changeDetectorRef.markForCheck();
      }
    });

  }
  constructor(private _websocketService: WebsocketService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _formBuilder: UntypedFormBuilder,
    private _chequeService: CreerRemiseService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
   

  ) {
    _websocketService.messages.subscribe(msg => {

      //
      // const predefinedJson = [


      //   {
      //     "imageVerso": "....",
      //     "imageRecto": "....",
      //     "numChq": "0000001",
      //     "montant": 100,
      //     "codeBanque": "CI131",
      //     "codeAgence": "01001",
      //     "cleRib": "78",
      //     "compte": "012345678901",
      //     "cleRibIsCorrect": true,
      //     "numChequeIsCorrect": true,
      //     "compteIsCorrect": true,
      //     "codeBanqueIsCorrect": true,
      //     "codeAgenceIsCorrect": true,
      //     "chequeIsCorrect": true,
      //     "tire": "GOMPOU MARC"
      //   },

      //   {
      //     "imageVerso": "....",
      //     "imageRecto": "....",
      //     "numChq": "0000021",
      //     "montant": 200,
      //     "codeBanque": "CI131",
      //     "codeAgence": "01002",
      //     "cleRib": "78",
      //     "compte": "012345678905",
      //     "cleRibIsCorrect": true,
      //     "numChequeIsCorrect": true,
      //     "compteIsCorrect": true,
      //     "codeBanqueIsCorrect": true,
      //     "codeAgenceIsCorrect": true,
      //     "chequeIsCorrect": true,
      //     "tire": "AHOUE CEDRICK"
      //   }

      //   , ];

      // Charger le tableau received à partir du JSON
      // this.received = predefinedJson as Cheque[] ;
      //this._chequeService.setRemise$(this.received);

      if (msg.action === "neoEtat") {
        this.scannerIsConnected = msg.result === "demarré";
      }
      // CHargement du tableau des chèques dans la creation de remise
      else {
        if (msg.action === "neoResult") {
          this.received.push(JSON.parse(msg.result) as Cheque);
          this._chequeService.setRemise$(this.received);
          console.log("Response received: --------", this.received);

          console.log("Response dataSource verifier -------: ", this.dataSource);

        }
      }
      console.log("Response from websocket: ", msg);

      this._changeDetectorRef.markForCheck();
    });
  }

  selectedRow(row) {

    const index = this.received.findIndex(chq => chq.numChq === row.numChq);
  
    this._router.navigate(['./details', index], { relativeTo: this._activatedRoute });
    // this..disable();
    this._changeDetectorRef.markForCheck();
    this.chequeData = row;


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

  openDetailComponent(component: DetailsChequeComponent) {

    component.matDrawer = this.matDrawer;
    component.endpoint = "compteClient";
    component.formTitle = "CHEQUE";
    component.chequeData = this.chequeData;
    // component.dataSource = this.dataSource;


    component.formFields = [
      // {
      //   key: "default",
      //   libelle: "default",
       

      // },
     
      {
        key: "numChq",
        libelle: "Numero de Cheque",
        validators: {
          min: 7,
          max: 7,
          required: true,
          // required:true
          //regex
        }

      },
      {
        key: "codeBanque",
        libelle: "Code Banque",
        //type:"number",
        // maxlengh:5,
        placeholder: "Ex: 01001",
        validators: {
          min: 5,
          max: 5,
          required: true,
          // required:true
          //regex
        }

      },
      {
        key: "codeAgence",
        libelle: "Code Agence",
        validators: {
          min: 5,
          max: 5,
          required: true,
        }

      },

      {
        key: "compte",
        libelle: "Compte",

        validators: {
          min: 12,
          max: 12,
          required: true,
        }

      },

      {
        key: "cleRib",
        libelle: "Cle Rib",
        validators: {
          min: 2,
          max: 50,
          required: true,
          //  email:true
        }

      },


      {
        key: "montant",
        libelle: "Montant",
        type: "number",
        validators: {
          minValue: 1000,
          min: 1,
          max: 11,

          required: true,
          //  email:true
        }

      },
      {
        key: "tire",
        libelle: "Titulaire",
        validators: {
          min: 2,
          max: 50,
          required: true,
          //  email:true
        }

      }

    ]
  }
  onBackdropClicked(): void {
    // Go back to the list
    this._router.navigate(['./'], { relativeTo: this._activatedRoute });

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }


  loadCompte(){
    this._chequeService.compteEntreprises$.pipe(takeUntil(this._unsubscribeAll)
    ).subscribe({
        next: (response:any) => {
          console.log("ResponsecompteEntreprises===>------------------ :", response);
          if(response==null){response=[];}
         
          this.listeCompteEntreprise = response.data;

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

/**
   * Enregistrer
   */
 
// {
//   "idCompte":4,
//   "cheques":[{
//       "imageRecto":""               
//       "imageVerso":"",
//       "numChq": "9147290",
//       "codeBanque": "CI032",
//       "cleRib": "20",
//       "compte": "002032230004",
//       "montant": 5044800,
//       "chequeIsCorrect": true,
//       "titulaire":"Maikol",
//       "agence":"01030"
//   }]
// }

  onSubmit() {
  
   if(this.compteClientForm.valid){

    
    let idCompteClient=this.compteClientForm.value.idCompteClient;
    let listCheques:any[] = [];

    let chqObject:any={};
    this.received.forEach(chq=> {
        chqObject.imageVerso = img;
        chqObject.imageRecto = img;
        chqObject.numChq=chq.numChq;
        chqObject.codeBanque=chq.codeBanque;
        chqObject.titulaire=chq.tire;
        chqObject.cleRib=chq.cleRib;
        chqObject.chequeIsCorrect=true;
        chqObject.agence=chq.codeAgence;
        chqObject.compte=chq.compte;
        chqObject.montant=chq.montant;

        console.log("chq------",chq);
        listCheques.push(chqObject);
      })
      console.log("chqObject------",listCheques);

    
      this._chequeService.create({idCompte:idCompteClient, cheques:listCheques}).subscribe({
        next: (response) => {
          this.alert = {
            type: 'success',
            message: response.message
          };
          this.showAlert = true;
        },
        error: (error) => {
          console.error('Error : ', JSON.stringify(error));
          this.alert = { type: 'error', message: error.error.message ?? error.message };
          this.showAlert = true;
          this._changeDetectorRef.detectChanges();
        }
      });
    }
  
  
  
  }
  




  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }


  // deleteSelectedCheque() {


  // }

  // getCompteByEntreprise(){
      
  // };

  // updateSelectedCheque() {


  // }


  //PRIVATE METHODE
  sendMsg() {
    let message = {
      action: '',
      command: '',
      result: ''
    }
    message.action = this.action;
    message.command = this.command;

    this.sent.push(message);
    this._websocketService.messages.next(message);
  }


  scannerCheque() {

    let message = {
      action: 'SCAN',
      command: '',
      result: ''
    }

    this.sent.push(message);
    this._websocketService.messages.next(message);
  }


  closeDetails(): void {
    this.selectedCheque = null;
  }


  trackByFn(index: number, item: any): any {
    return item.id || index;
  }


  toggleDetails(numChq: string): void {
    // If the product is already selected...
    if (this.selectedCheque && this.selectedCheque.numChq === numChq) {
      // Close the details
      this.closeDetails();
      return;
    }

    // // Get the product by id
    this._chequeService.getChequeById(numChq)
      .subscribe((cheque) => {

        // Set the selected product
        this.selectedCheque = cheque;

        // Fill the form
        this.selectedChequeForm.patchValue(cheque);

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });



  }
}
