import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
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
  @Input() formFields!: any;
  drawerMode: 'side' | 'over';
  noData: any;
  chequeData: any;
  listeCompteEntreprise: any[] = [];
  montantTotal:number=0;
  nombreCheque:number=0;
  remiseIsInCorrect:boolean=true;
  //listeCompteEntreprise: any;
 

  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;
  

  command = 'StartScanner';
  action = 'CONNECT';
  neostate='0';
  // received: Cheque[] = [];
  totalRows = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 25];
  filteredOptionCompteEnt: Observable<string[]>;
  dataSource: MatTableDataSource<Cheque> = new MatTableDataSource<Cheque>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  showAlert: boolean = false;
  //Permet d'acceder plus facilement aux données sans utiliser les fonctions
  //(les fonction causes des soucis de performances du aux appels multiples a chaque rendue)
  restructuredData: any = {};


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
    },
    {
      "key": "imagerecto",
      "label": "imagerecto"
    },

    {
      "key": "imageverso",
      "label": "imageverso"
    }

  ];

  public displayedColumns: string[] = ['numChq', 'codeBanque', 'codeAgence', 'compte', 'cleRib', 'montant', 'tire'];

  sent = [];
  isLoading = false;
  selectedCheque: any | null = null;
  selectedChequeForm: UntypedFormGroup;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  scannerIsConnected = false;


  compteClientForm = new FormGroup({
    idCompteClient: new FormControl<any>('', Validators.required)

  })

  constructor(private _websocketService: WebsocketService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _chequeService: CreerRemiseService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _fuseMediaWatcherService: FuseMediaWatcherService,) 
    
    {
      
      this.initiateWebsocketConnexion();


      

     
  }

form: FormGroup;


  

  //CYCLE DE VIE
  ngOnInit() {
    this._chequeService.setRemise$([]);
    this._websocketService.getSocketCloseObservable().pipe(takeUntil(this._unsubscribeAll)).subscribe((event: CloseEvent) => {
      this.scannerIsConnected=false;
      this._changeDetectorRef.markForCheck();
    });

    
    this.dataStructure.forEach((element) => {
      this.restructuredData[element.key] = element;
    });



    //getCompteByEntreprise();
    this.loadCompte();
    this._websocketService.messages.next({ command: this.command, action: this.action, result: "", neostate: "0" ,token:localStorage.getItem("accessToken")
  
  
  });
    

   

      


    this._chequeService.remise$.pipe(takeUntil(this._unsubscribeAll)
    ).subscribe({
      next: (table) => {
        console.log("-------table------", table);
        if(table!=null){
          
          //Verifier si le cheque est valide
          this.remiseIsInCorrect = !table.reduce((accumulator: boolean, cheque: Cheque) => {
            return accumulator && cheque.chequeIsCorrect && (cheque.montant>=1000) ;
          }, true);
          



          this.montantTotal=table.reduce((total, obj) => total + obj.montant, 0);
          this.nombreCheque=table.length;

         
          this._changeDetectorRef.markForCheck();

        }else{

          this.montantTotal=0;
          this.nombreCheque=0;
          this.remiseIsInCorrect=true;
          table=[];
          
        }
        this.dataSource = new MatTableDataSource(table);
        this._changeDetectorRef.markForCheck();
      }
      
    });

    this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {

                // Set the drawerMode if the given breakpoint is active
                if ( matchingAliases.includes('lg') )
                {
                    this.drawerMode = 'side';
                }
                else
                {
                    this.drawerMode = 'over';
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

  }


  initiateWebsocketConnexion(){
    this._websocketService.messages.pipe(takeUntil(this._unsubscribeAll)).subscribe(msg => {

      if (msg.action === "neoEtat" ) {
        this.scannerIsConnected = 
        (msg.result != "Deconnecté") ||
        (msg.result == "Deconnecté" && msg.neostate == "4") ;
    
     
      }
      // CHargement du tableau des chèques dans la creation de remise
      else {
        if (msg.action === "neoResult"){
          this.scannerIsConnected = true;
          let chqScanned=JSON.parse(msg.result) as Cheque;

          //Si le cheque est déjà dans le tableau  ne pas l'ajouter 
          let findCheque=this.dataSource.data.find(chq=>{
          return chq.codeAgence==chqScanned.codeAgence &&  
            chq.codeBanque==chqScanned.codeBanque &&  
            chq.codeAgence==chqScanned.codeAgence &&
            chq.compte==chqScanned.compte &&
            chq.numChq==chqScanned.numChq ;
          });
 
          if(!findCheque){
            this.dataSource.data.push(chqScanned);
            this._chequeService.setRemise$(this.dataSource.data);
            console.log("Response received: --------", this.dataSource.data);
            //console.log("Response dataSource verifier -------: ", this.dataSource);
          }
          else{
            const errorMessage=`Vous avez déjà scanné ce chèque (${chqScanned.numChq}) plus d'une fois`;
            console.log("cheque exist=====>",errorMessage)
            this.alert = { type: 'error', message:errorMessage };
            this.showAlert = true;
          }
        }
      }
      
      console.log("Response from websocket: ", msg);
      
      this._changeDetectorRef.markForCheck();
    })
  }
  

  closeAlert() {
    this.showAlert = false; // Définir showAlert à false pour masquer l'alerte lorsque l'utilisateur clique sur la croix
  }
  selectedRow(row) {

    const index= this.dataSource.data.indexOf(row);
    this._router.navigate(['./details', index], { relativeTo: this._activatedRoute });
    this.chequeData = row;
    this._changeDetectorRef.markForCheck();
  }




  openDetailComponent(component: DetailsChequeComponent) {

    component.matDrawer = this.matDrawer;
    // component.endpoint = "compteClient";
    component.formTitle = "CHEQUE";
    component.chequeData = this.chequeData;
    //Initialisation formulaire details
    component.loadDataOnInit=true;
    component.formFields = [
      {
        key: "numChq",
        libelle: "N° de Cheque",
        validators: {
          min: 7,
          max: 7,
          required: true
        }
      },
      {
        key: "codeBanque",
        libelle: "Code Banque",
        placeholder: "Ex: CI131",
        validators: {
          min: 5,
          max: 5,
          required: true,
        }
      },
      {
        key: "codeAgence",
        libelle: "Code Agence",
        placeholder: "Ex: 01001",
        validators: {
          min: 5,
          max: 5,
          required: true
        }
      },

      {
        key: "compte",
        libelle: "Compte",
        validators: {
          min: 12,
          max: 12,
          required: true
        }
      },
      {
        key: "cleRib",
        libelle: "Cle Rib",
        validators: {
          min: 2,
          max: 50,
          required: true
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
          required: true
        }

      },
      {
        key: "tire",
        libelle: "Titulaire",
        validators: {
          max: 50
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
          console.log("Response compteEntreprises ===>", response);
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



  onSubmit() {
    
    if(this.compteClientForm.valid && ! this.remiseIsInCorrect){
    let idCompteClient=this.compteClientForm.value.idCompteClient;
    let listCheques:any[] = [];

    this.dataSource.data.forEach(chq=> {
        console.log("enregistrer chq======>",chq);
        listCheques.push({
          imageVerso :chq.imageVerso ,
          imageRecto : chq.imageRecto ,
          numChq:chq.numChq,
          codeBanque:chq.codeBanque,
          titulaire:chq.tire,
          cleRib:chq.cleRib,
          chequeIsCorrect:true,
          agence:chq.codeAgence,
          compte:chq.compte,
          montant:chq.montant
        });
      })
      console.log("chqObjectVERIF-------------",listCheques);

    
      this._chequeService.create({idCompte:idCompteClient, cheques:listCheques}).pipe(takeUntil(this._unsubscribeAll)).subscribe({
        next: (response) => {
          this.alert = {
            type: 'success',
            message: response.message
          };
          //Vide le tableau
          this._chequeService.updateDataTable([]);
          this.dataSource =new MatTableDataSource<Cheque>([]);// Réinitialise le tableau
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
  




  ngOnDestroy(): void {

    // Unsubscribe from all subscriptions
    console.log("unsubscribe");
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();

  }



  //PRIVATE METHODE
  sendMsg() {
    let message = {
      action: '',
      command: '',
      result: '',
      
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
      result: 'demarré'
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
    this._chequeService.getChequeById(numChq).pipe(takeUntil(this._unsubscribeAll))
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
