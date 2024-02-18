import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseAlertType } from '@fuse/components/alert';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Subject, takeUntil } from 'rxjs';
import { TransactionService } from '../transaction-bancaire.service';
import {  MatDialog } from '@angular/material/dialog';
import { TableDataService } from 'app/modules/admin/common/table-data/table-data.services';

@Component({
  selector: 'app-details-transaction',
  templateUrl: './details-transaction.component.html',
  styleUrls: ['./details-transaction.component.scss']
})
export class DetailsTransactionComponent implements OnInit {
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  drawerMode: 'side' | 'over';
  transactionData: any;
  montantTotal: number = 0;
  nombreRemise: number = 0;
  canRelance: boolean = false;
  id: string = "";
  isLoading = false;
  pageSizeOptions: number[] = [10, 25];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  showAlert: boolean = false;

  public dataStructure = [

    {
      "key": "codeBanque",
      "label": "Code Banque"
    },

    {
      "key": "codeagence",
      "label": "Code agence"

    },
    {
      "key": "numCompte",
      "label": "Numero compte"
    },
    {
      "key": "motif",
      "label": "Motif"

    },
    {
      "key": "nomClient",
      "label": "Nom Débit"

    },
    {
      "key": "nomBanque",
      "label": "Nom banque"
    },

    {
      "key": "montant",
      "label": "Montant",
      "type": "montant"

    },

    { 
      key: 'statut', 
      type:'status',
      label: 'Etat prelev.', 
      "statusValues":[
        { value: 1, libelle: "Enregistré", color: "#2986cc" }, // Green
        { value: 3, libelle: "Exporté", color: "#16537e" }, // Green
        { value: 13, libelle: "Payé", color: "#68D391" }, // Green
        { value: 10, libelle: "Debit. interdit", color: "#FF5733" }, // Orange
        { value: 40, libelle: "Cpte. fermé", color: "#808080" }, // Gray
        { value: 50, libelle: "Cpte. inexistant", color: "#FFD700" }, // Yellow
        { value: 60, libelle: "Rejetée", color: "#F56565" } // Red
      ]
    },

    {
      "key": "dateEcheance",
      "label": "Date echéance",
      "type":"date"
    },
  ];



  public displayedColumns: string[] = ["codeBanque","codeagence","numCompte","montant","motif","nomClient","nomBanque","dateEcheance","statut"];


  

  goBackToList(): void {
    // Go back to the list
    this._router.navigate(['../../'], { relativeTo: this._activatedRoute });
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }


  constructor(private _changeDetectorRef: ChangeDetectorRef,
    private _transactionService :TransactionService,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _tableDataService:TableDataService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router) {}

  ngOnInit(): void {
    //Recuperation de la ligne selectionner dans la liste des transaction de tableData common
    this._transactionService.transactionRemise$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response)=>{
      console.log("------------------------------------------------------------->",response?.data) 
      this.transactionData=response?.data;
      this.montantTotal=response?.data?.mtTotal || 0;
     
    });
    this._tableDataService.datas$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response)=>{
      console.log("details transaction response=======>",response)
      let result:any=response;
      let findPrelevToRelance=result?.data?.findIndex((el) =>  el.statut==10||el.statut==40);//debit interdit et rejeté
      this.canRelance=findPrelevToRelance!=-1 && findPrelevToRelance!=null && findPrelevToRelance!=undefined;    
      console.log("canRelance===>",this.canRelance)
    });

    this._activatedRoute.params.subscribe(params => {
      this.id = params['id'];
    })


    // Subscribe to media changes
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
        }
    );
  }

  validerTransaction(){
    console.log("valider transaction id", this.transactionData);
    // this._transactionService.validerTransaction(this.transactionData.id).pipe().subscribe({
    //   next:(response)=>{
    //       console.log(response);
    //       this.goBackToList();
    //       this.showAlert = true;
    //   }
      
    // });
  }
  AnnulerTransaction(){
    console.log("valider transaction id", this.transactionData);
    // this._transactionService.validerTransaction(this.transactionData.id).pipe().subscribe({
    //   next:(response)=>{
    //       console.log(response);
    //       this.goBackToList();
    //       this.showAlert = true;
    //   }
      
    // });
  }

  telechargerTransaction(): void {
    
    // this._transactionService.telechargerRetourTransaction(this.transactionData.id).pipe().subscribe(blob => {
    //   // Create a temporary anchor element and trigger the download
    //   const link = document.createElement('a');
    //   link.href = window.URL.createObjectURL(blob);
    //   link.download = this.transactionData.nomfichier+".emi"; // Set the desired file name
    //   console.log("statut prel",this.transactionData.statut);
    //   link.click();
    // });
  }
  telechargerRelance(): void {
    // this._transactionService.telechargerRelance(this.transactionData.id).pipe().subscribe();
    
  }

}
