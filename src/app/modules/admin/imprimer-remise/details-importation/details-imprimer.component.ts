import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseAlertType } from '@fuse/components/alert';
import { Remise } from '../remise.type';
import { DetailsChequeComponent } from '../../remise-aller/remise-aller/details-cheque/details-cheque.component';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CreerRemiseService } from '../../remise-aller/remise-aller/remise.service';
import { TableDataService } from '../../common/table-data/table-data.services';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Subject, takeUntil } from 'rxjs';
import { ImprimerRemiseService } from '../imprimer-remise/imprimer-remise.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeleteChequeConfirmationComponent } from '../../remise-aller/remise-aller/details-cheque/delete-confirmation/delete-cheque-confirmation.component';
import { DetailsRemiseComponent } from '../../valider-remise/details-remise/details-remise.component';
//import {jsPDF} from "jspdf";
import html2pdf from 'html2pdf.js';


import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-details-remise',
  templateUrl: './details-imprimer.component.html',
  styleUrls: ['./details-imprimer.component.scss']
})
export class DetailsImprimerComponent implements OnInit {
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  drawerMode: 'side' | 'over';
  noData: any;
  remiseData: any;
  montantTotal: number = 0;
  nombreRemise: number = 0;
  remiseIsInCorrect: boolean = true;
  id: string = "";
  isLoading = false;

@ViewChild('content',{static: false}) el!: ElementRef;
  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;


  action = 'CONNECT';
  received: Remise[] = [];
  totalRows = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 25];

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  chequeData: any;
  remiseImprimerData: any;
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
    {
      "key": "mtTotal2",
      "label": "Montant Total2"

    },

  ];


  public displayedColumns: string[] = ['reference', 'dateCreation', 'numCompte', 'nbCheques', 'mtTotal','mtTotal2'];

  
// imprimerPDF(){
 

//    // Créez une nouvelle instance de jsPDF
 
//    // Définissez le contenu de l'en-tête HTML
//    const headerHTML = `
//      <div style="text-align: center;">
//        <h1>Mon En-tête HTML</h1>
//        <p>Informations d'en-tête</p>
//      </div>
//    `;

//    // Ajoutez l'en-tête HTML à chaque page
//    doc.setPage(1); // Page 1
//    doc.html(headerHTML, {
//      callback: () => {
//        // Après avoir ajouté l'en-tête, générez le contenu du PDF ici
//        // Par exemple, ajoutez une table avec jspdf-autotable
//        doc.autoTable({
//          startY: 40, // Ajustez la position en fonction de la hauteur de votre en-tête
//          head: [['Nom', 'Âge']],
//          body: [['John Doe', 30], ['Jane Smith', 28]],
//        });

//        // Générez d'autres pages si nécessaire
//        doc.addPage();
//        // ... Ajoutez du contenu à d'autres pages ici
//      },
//    });

   // Sauvegardez ou affichez le PDF
//    doc.save('document.pdf');
 
  
 
// }
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

  

  constructor(private _changeDetectorRef: ChangeDetectorRef,
    private _formBuilder: UntypedFormBuilder,
    private _chequeService: CreerRemiseService,
    private _imprimerRemiseService:ImprimerRemiseService,
    private _tableDataService: TableDataService,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _dialog: MatDialog,
    private _activatedRoute: ActivatedRoute,
    private _router: Router) {}

  ngOnInit(): void {
    //Recuperation de la ligne selectionner dans la liste des remise de tableData common
    this._tableDataService.data$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response)=>{
      console.log("details imprimer remise response=======>",response)
      this.remiseImprimerData=response;
    })

    this._activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      console.log("id in details", this.id);
    })

    // Subscribe to MatDrawer opened change
  //   this.matDrawer.openedChange.subscribe((opened) => {
  //     if ( !opened )
  //     {
  //         // Mark for check
  //         this._changeDetectorRef.markForCheck();
  //     }
  // }
  
//  );

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

  validerRemise(){
    console.log("valider remise id", this.chequeData);
    this._imprimerRemiseService.validerRemise(this.chequeData.id).pipe().subscribe({
      next:(response)=>{
          console.log(response);
          this.goBackToList();
      }
    });
  }







  supprimerRemise(){
    
    const deleteObjectDialog = this._dialog.open(
        DeleteChequeConfirmationComponent,
        {
          data:  { 
              id:this.id,
              cheques:null,
              endpoint:"exportation"
            }
        }
    );
    deleteObjectDialog.afterClosed().subscribe({
        next:(response)=>{

          console.log("delete response=====>",response)
          if(response?.isDeleted){
              this.goBackToList();
              console.log("delete remise response===>",response)
          }
        },
        error: (error) => {
          console.error('Error : ', JSON.stringify(error));
          this.alert = { type: 'error', message: error.error.message??error.message };
          this.showAlert = true;
          this._changeDetectorRef.detectChanges();
      }
    });



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

}
