import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseAlertType } from '@fuse/components/alert';
import { Prelevement } from '../../prelevement.type';
//import { DetailsChequeComponent } from '../../prelevement-aller/prelevement-aller/details-cheque/details-cheque.component';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
//import { CreerRemiseService } from '../../prelevement-aller/prelevement-aller/prelevement.service';
import { TableDataService } from '../../../common/table-data/table-data.services';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Subject, takeUntil } from 'rxjs';
import { ValiderPrelevementService } from '../valider-prelevement.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
//import { DeleteChequeConfirmationComponent } from '../../prelevement-aller/prelevement-aller/details-cheque/delete-confirmation/delete-cheque-confirmation.component';

@Component({
  selector: 'app-details-prelevement',
  templateUrl: './details-prelevement.component.html',
  styleUrls: ['./details-prelevement.component.scss']
})
export class DetailsPrelevementComponent implements OnInit {
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  drawerMode: 'side' | 'over';
  prelevementData: any;
  montantTotal: number = 0;
  nombreRemise: number = 0;
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
      "key": "dateEcheance",
      "label": "Date echéance",
      "type":"date"
    },


  ];



  public displayedColumns: string[] = ["codeBanque","codeagence","numCompte","montant","motif","nomClient","nomBanque","dateEcheance"];


  onBackdropClicked(): void {
    // Go back to the list
    this._router.navigate(['../../'], { relativeTo: this._activatedRoute });

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  goBackToList(): void {
    // Go back to the list
    this._router.navigate(['../../'], { relativeTo: this._activatedRoute });

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  getColumnHeaderText(column: string): string {
    //  console.log("column===>",column)
    let found = this.dataStructure.find(e => e.key == column);
    return found ? found.label : "";
  }

  constructor(private _changeDetectorRef: ChangeDetectorRef,
    private _formBuilder: UntypedFormBuilder,
   // private _chequeService: CreerPrelevementService,
    private _validerPrelevementService:ValiderPrelevementService,
    //private _telechargerPrelevementService:ValiderPrelevementService,
    private _tableDataService: TableDataService,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _dialog: MatDialog,
    private _activatedRoute: ActivatedRoute,
    private _router: Router) {}

  ngOnInit(): void {
    //Recuperation de la ligne selectionner dans la liste des prelevement de tableData common
    this._tableDataService.data$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response)=>{
        this.prelevementData=response;
        console.log(response);

        this.montantTotal=response?.mtTotal || 0;
    })

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

  validerPrelevement(){
    console.log("valider prelevement id", this.prelevementData);
    this._validerPrelevementService.validerPrelevement(this.prelevementData.id).pipe().subscribe({
      next:(response)=>{
          console.log(response);
          this.goBackToList();
          this.showAlert = true;
      }
      
    });
  }

  telechargerPrelevement(): void {
    
    this._validerPrelevementService.telechargerRetourPrelevement(this.prelevementData.id).pipe().subscribe(blob => {
      // Create a temporary anchor element and trigger the download
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = this.prelevementData.nomfichier+".emi"; // Set the desired file name
     console.log("statut prel",this.prelevementData.statut);
      link.click();
    });
  }

}
