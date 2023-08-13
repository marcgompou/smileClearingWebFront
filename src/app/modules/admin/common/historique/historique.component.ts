import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { HistoriqueService } from './historique.services';
import { Historique } from './historique.types';

@Component({
  selector: 'historiques',
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations
})
export class HistoriqueComponent implements OnChanges, AfterViewInit {

  @Input('endpoint') endpoint: string;

  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };

  showHistorique:boolean = false;
  showAlert: boolean = false;

  affichageMode:string = 'Tableau';

  /**DataTable */
  selectedRowIndex: any;
  _dataSource: MatTableDataSource<Historique>;
  _displayedColumns: string[] = ['date', 'auteur', 'action', 'etatInitial', 'etatFinal', 'commentaires'];
  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;

  /** historique */
  _historiques:Historique[] = [];
  _filteredHistoriques: Historique[];

  constructor(
    private _historiqueService: HistoriqueService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }


  ngOnChanges(changes: SimpleChanges) {
    this.getHistoriques();
  }

  ngAfterViewInit(): void {
    if (this._dataSource != null && this._dataSource.filteredData.length) {
      this._dataSource.sort = this._sort;
      this._dataSource.paginator = this._paginator;
      this._changeDetectorRef.detectChanges();
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  onChangeMode(event) {
    this.affichageMode = event.value;
  }
  /**
   * 
   * @param event 
   */
  applyFilter(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    const queryLower = query.trim().toLowerCase();
    console.log('queryLower: ',queryLower);
    if(this.affichageMode === 'Tableau'){
      this._dataSource.filter = queryLower;
      this._changeDetectorRef.detectChanges();
    }else if(this.affichageMode === 'Time line'){
      this._filteredHistoriques = this._filterHistroiques(queryLower || '');
      this._changeDetectorRef.detectChanges();
    }
    
  }

  private _filterHistroiques(value: string): Historique[] {
    return this._historiques.filter(historique => historique.actionAuteur?.toLowerCase().includes(value) || historique.actionDate?.toLowerCase().includes(value) || historique.etatInitial?.toLowerCase().includes(value) || historique.actionType?.toLowerCase().includes(value) || historique.etatFinal?.toLowerCase().includes(value));
  }
  /**
   * 
   * @param row 
   */
  selctedRow(row: Historique) {
    this.selectedRowIndex = row.actionDate;
    this._changeDetectorRef.detectChanges();
  }

  /**
   * Récuperer les historiques de l'objet
   */
   getHistoriques():void{
    // Hide the alert
    this.showAlert = false;
    this._historiqueService.getHistoriques(
      this.endpoint
    ).subscribe({
        next: (historiques:Historique[]) => {
          console.log("Response :", historiques);
          //show historique
          this.showHistorique = true;

          // Update the historiques
          this._historiques = historiques;
          this._filteredHistoriques = historiques;
          this._dataSource = new MatTableDataSource(historiques);

          this._changeDetectorRef.detectChanges();
        }, error: (error) => {
          //not show historique
          this.showHistorique = false;
          console.error('Error : ',JSON.stringify(error));
          // Set the alert
          this.alert = { type: 'error', message: error.error.message??error.error };
          // Show the alert
          this.showAlert = true;
          
          this._changeDetectorRef.detectChanges();
        }
    });
  }

}
