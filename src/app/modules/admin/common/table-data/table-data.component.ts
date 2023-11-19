import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { TableDataService } from "./table-data.services";
import { FuseAlertType } from "@fuse/components/alert";
import { takeUntil, Subject } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { DetailsService } from "../details/details.service";
import { fuseAnimations } from "@fuse/animations";

interface filterForm {
  label: string;
  key: string;
  type?: string;
  statusValues?: any;
}

@Component({
  selector: "app-table-data",
  templateUrl: "./table-data.component.html",
  styleUrls: ["./table-data.component.scss"],
  // encapsulation  : ViewEncapsulation.None,
  // changeDetection: ChangeDetectionStrategy.OnPush,
  // animations     : fuseAnimations
})
export class TableDataComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private _tableDateService: TableDataService,
    private _detailsService: DetailsService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {}
  @Input("filterObject") filterObject: any = null;
  @Input("dataStructure") dataStructure: filterForm[];
  @Input("displayedColumns") displayedColumns: string[];
  data: any[];
  @Input("endpoint") endpoint: string="";
  @Input("serverSideLoad") serverSideLoad: boolean = true;
  @Input("filterFormBasic") filterFormBasic: filterForm[];
  @Input("filterFormAdvance") filterFormAdvance: filterForm[];
  @Input("title") title: string="";
  @Input("canClick") canClick: boolean = false;
  @Input("idRow") idRow: string = "";
  /*** Peut prendre la valeur '$' si les donnée sont directement accessible depuis la racine ***/
  @Input("dataKey") dataKey = "data"; 
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private selectedRowIndex: any=undefined;
  alert: { type: FuseAlertType; message: string } = {
    type: "success",
    message: "",
  };

  showAlert: boolean = false;
  showData: boolean = true;
  paginationObject = {
    page: 0,
    size: 10,
  };
  /**DataTable */
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  isLoading = false;
  public totalRows:number = 0;
  pageSize: number = 10;
  currentPage: number = 0;
  pageSizeOptions: number[] = [10, 25];
  _displayedColumns: string[];

  //Permet d'acceder plus facilement aux données sans utiliser les fonction
  //(les fonction causes des soucis de performances du aux appels multiples a chaque rendue)
  restructuredData: any = {};

  ngOnInit(): void {
    //Load initial data

    this.dataStructure.forEach((element) => {
      this.restructuredData[element.key] = element;
    });

    this._detailsService.id$.subscribe((id) => {
      this.selectedRowIndex=id||undefined;

      console.log("=============_detailsService==========>",this.selectedRowIndex);
      //this.selectedRowChangeColor(id);
    })

    this._changeDetectorRef.markForCheck();
  }

  selectedRow(row) {
    if (this.canClick) {
      this._router.navigate(["./details", row[this.idRow]], {
        relativeTo: this._activatedRoute,
      });
      this.selectedRowIndex=row[this.idRow]
      this._tableDateService.setData$(row);
      this._changeDetectorRef.markForCheck();
    }
  }

  selectedRowChangeColor(id):void {
    this.selectedRowIndex= this.dataSource.data?.find(item => item[this.idRow] === id) ??undefined;
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
    this.loadData();
    this._changeDetectorRef.detectChanges();
  }

  pageChanged(event: PageEvent) {
    console.log("evenement--------------------", { event });
    console.log(
      "paginationObject------------------------",
      this.paginationObject
    );


    if(this.serverSideLoad){
      this.paginationObject = {
        size: event.pageSize,
        page: event.pageIndex,
      };
      this._tableDateService._paginationObject = this.paginationObject;
      this._tableDateService._endpoint = this.endpoint;
      this._tableDateService._filterObject = this.filterObject;
      this._tableDateService.getDatas().pipe().subscribe();
    }else{

       // Calculate the start and end index based on the page size and page index
      const startIndex = event.pageIndex * event.pageSize;
      const endIndex = startIndex + event.pageSize;
      this.pageSize=event.pageSize;
      this.currentPage=event.pageIndex;
      console.log("start and end index",startIndex +' '+ endIndex);
      // Slice the data to display the current page
      const pageData = this.data.slice(startIndex, endIndex);
      this.dataSource.data = pageData
      console.log("length===>",this.data.length);

    }
    this._changeDetectorRef.markForCheck();
  }

  //Retrieve response data from dynamic json path;
  //In case data is in nested json
  getValueByPath(obj, path) {
    let value = obj;

    if(path=="$"||path==""){
      return value;
    }
    const pathParts = path.split(".");
    console.log(obj);
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

  /**
   * Récuperer les données du tableau  de l'objet
   */
  loadData(): void {
    // Hide the alert
    this._tableDateService._paginationObject = this.paginationObject;
    this._tableDateService._endpoint = this.endpoint;
    this._tableDateService._filterObject = this.filterObject;
    this.showAlert = false;
    this._tableDateService.datas$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          console.log("Response table data===> :", response);

          let data: any[] = [];
          if (response == null) {
            response = [];
          }
          data = this.getValueByPath(response, this.dataKey);
          this.data=data;

          if(this.serverSideLoad){
            this.dataSource = new MatTableDataSource<any>(data);
            console.log("response?.totalCount ||0;",response?.totalCount ||0);
            console.log("response ||0;",response);
            console.log("response?.totalCount ||0;",response?.totalCount);

            this.totalRows = response?.totalCount ||0;
            this.currentPage = response?.page || 0;
            this.pageSize = response?.pageSize || 0;
            this._changeDetectorRef.markForCheck();

          }else{
            this.dataSource = new MatTableDataSource<any>([]);
            //Si toutes les données sont chargées une seule fois ?
            console.log("start and end index",this.currentPage +' '+ this.pageSize);
            
            //si le tableau est vide
            if(data.length){
              this.dataSource = new MatTableDataSource(this.data.slice(this.currentPage, this.pageSize));           
            }
            this.totalRows =  data.length;
          }
          
          this._changeDetectorRef.markForCheck();
        },
        error: (error) => {
          //not show historique
          this.showData = false;
          console.error("Error : ", JSON.stringify(error));
          // Set the alert
          this.alert = {
            type: "error",
            message: error.error.message ?? error.error,
          };
          // Show the alert
          this.showAlert = true;

          this._changeDetectorRef.markForCheck();
        },
      });
  
  
    }
}
