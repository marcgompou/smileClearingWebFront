import { AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableDataService } from './table-data.services';
import { FuseAlertType } from '@fuse/components/alert';
import { takeUntil,Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

interface filterForm {
  label: string;
  key: string;
  type?:string;
};

@Component({
  selector: 'app-table-data',
  templateUrl: './table-data.component.html',
  styleUrls: ['./table-data.component.scss']
})

//AJOUTER DANS  APPMODULE   providers: [{ provide: LOCALE_ID, useValue: 'fr' }],


export class TableDataComponent  implements OnInit, AfterViewInit, OnDestroy  {

 

  constructor(
    private _tableDateService: TableDataService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _activatedRoute: ActivatedRoute) 
  { 

  }

  @Input("filterObject") filterObject:any=null;
  @Input("dataStructure") dataStructure: filterForm[];
  @Input("displayedColumns") displayedColumns: string[];
  @Input("data") data: any[];
  @Input("endpoint") endpoint:string;
  @Input("filterFormBasic") filterFormBasic:filterForm[];
  @Input("filterFormAdvance") filterFormAdvance:filterForm[];
  @Input("title") title:string;
  @Input('canClick') canClick:boolean=false;
  @Input('idRow') idRow:string="";
  @Input('dataKey') dataKey="data";
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  
  showAlert: boolean = false;
  showData:boolean=true;
  paginationObject={
    page:0,
    size:10
    
  }
  /**DataTable */
  selectedRowIndex: any;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();  
  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  @ViewChild(MatSort)  sort: MatSort;
  
  
  
  
  isLoading = false;
  totalRows = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 25];
  _displayedColumns:string[]
  
  
  
  ngOnInit(): void {



    //Load initial data
    this.loadData();
    this._changeDetectorRef.markForCheck();
  }
  
  

  selectedRow(row){
    if(this.canClick){
      this._router.navigate(['./details', row[this.idRow]], { relativeTo: this._activatedRoute });
      this._tableDateService.setData$(row);
      this._changeDetectorRef.markForCheck();
    }
    
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
   // this._tableDateService.datas.next([]);  
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this._changeDetectorRef.detectChanges();

  }

  pageChanged(event: PageEvent) {
    console.log("evenement--------------------",{ event });
    console.log("paginationObject------------------------",this.paginationObject);

    this.paginationObject={

      size:event.pageSize,
      page:event.pageIndex
    };
    this._tableDateService._paginationObject = this.paginationObject;
    this._tableDateService._endpoint=this.endpoint;
    this._tableDateService._filterObject=this.filterObject;
    
    this._tableDateService.getDatas().pipe().subscribe();
    //this.loadData();
    
  }



  getColumnHeaderText(column: string): string {
    
  //  console.log("column===>",column)
    let found= this.dataStructure.find(e=>e.key==column) ;
    return found ? found.label : "";

  }

  getColumnType(column:string){

    let found= this.dataStructure.find(e=>e.key==column) ;
    return found ? found.type : "";
  }

  //Retrieve response data from dynamic json path;
  getValueByPath(obj, path) {
    const pathParts = path.split('.');
    let value = obj;
  
    for (const part of pathParts) {
      if (value.hasOwnProperty(part)) {
        value = value[part];
      } else {
        value = [];
        break;
      }
    }
  
    return value;
  }
  
  // Usage
  // const valueToRetrieve = getValueByPath(responseData, 'data.cheques[0].numChq');
  // console.log(valueToRetrieve); // Output: "7111689"
  



  /**
   * Récuperer les données du tableau  de l'objet
   */
  loadData():void{
    // Hide the alert
    this._tableDateService._paginationObject = this.paginationObject;
    this._tableDateService._endpoint=this.endpoint;
    this._tableDateService._filterObject=this.filterObject;
    this.showAlert = false;
    this._tableDateService.datas$.pipe(takeUntil(this._unsubscribeAll)
    ).subscribe({
        next: (response:any) => {
          console.log("Response===> :", response);
          
          let data:any[]=[];
          if(response==null){response=[];}
          data=this.getValueByPath(response, this.dataKey);
          this.dataSource = new MatTableDataSource(data);
          this.totalRows=response?.totalCount||data.length;
          this.currentPage=response?.page ||0;
          this.pageSize=response?.pageSize || 0;
          this._changeDetectorRef.markForCheck();
        }, 
        error: (error) => {
          //not show historique
          this.showData = false;
          console.error('Error : ',JSON.stringify(error));
          // Set the alert
          this.alert = { type: 'error', message: error.error.message??error.error };
          // Show the alert
          this.showAlert = true;
          
          this._changeDetectorRef.markForCheck();
        }
    });
  }
}
