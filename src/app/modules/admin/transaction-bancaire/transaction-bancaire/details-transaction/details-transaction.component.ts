import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseAlertType } from '@fuse/components/alert';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Subject, catchError, of, takeUntil } from 'rxjs';
import { TransactionService } from '../transaction-bancaire.service';
import { TableDataService } from 'app/modules/admin/common/table-data/table-data.services';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-details-transaction',
  templateUrl: './details-transaction.component.html',
  styleUrls: ['./details-transaction.component.scss'],
  animations: fuseAnimations
})
export class DetailsTransactionComponent implements OnInit {
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  drawerMode: 'side' | 'over';
  transactionData: any;
  montantTotal: number = 0;
  ancienSolde: number = 0;
  nouveauSolde: number = 0;
  canRelance: boolean = false;
  id: string = "";
  isLoading = false;

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
      "key": "codeGuichet",
      "label": "Code agence"
    },
    {
      "key": "numeroCpte",
      "label": "Numero compte"
    },
    {
      "key": "codeOpInterne",
      "label": "Code operation"
    },
    {
      "key": "libelle",
      "label": "Motif"
    },
    {
      "key": "montant",
      "label": "Montant",
      "type": "montant"
    },
    {
      "key": "dateOpe",
      "label": "Date operation",
      "type":"date"
    },

    {
      "key": "dateValeur",
      "label": "Date valeur",
      "type":"date"
    },
    
    {
      "key": "refRel",
      "label": "reference operation"
    },

   
  ];



  public displayedColumns: string[] = ["codeBanque","codeGuichet","numeroCpte","codeOpInterne","libelle","montant","dateOpe","dateValeur","refRel"];


  

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
    this._transactionService.transactionBancaire$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response)=>{
      console.log("------------------------------------------------------------->TESTTTT",response?.data) 
      this.transactionData=response?.data;
      this.nouveauSolde=response?.data?.montantNs || 0;
      this.ancienSolde=response?.data?.montantAs || 0;
     
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

  // validerTransaction(){
  //   console.log("valider transaction id", this.transactionData);
  // }
  // AnnulerTransaction(){
  //   console.log("valider transaction id", this.transactionData);
  // }

  telechargerTransaction(): void {
    this._transactionService.telechargerTransactionAfb(this.transactionData.id)
        .pipe(
            catchError(error => {
                console.error('Error : ', JSON.stringify(error));
                let message="";

              if (error.error.code == 404) {
                //error.error.message ?? error.error
                message = (error && error.error && error.error.message) ? 
                error.error.message : 
                "Le fichier sélectionné est introuvable";
              }

                this.alert = { type: 'error', message: message  };
                this.showAlert = true;
                this._changeDetectorRef.markForCheck();
                return of(null);
            })
        )
        .subscribe(blob => {
            if (blob) { // Vérifiez si blob n'est pas null suite à une erreur capturée
                // Créez un élément d'ancrage temporaire et déclenchez le téléchargement
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = this.transactionData?.nomFichier ; // Définissez le nom de fichier souhaité
                document.body.appendChild(link); // Ajoutez le lien au document pour garantir la compatibilité
                link.click();
                document.body.removeChild(link); // Nettoyez en supprimant le lien
            }
        });
  }


}
