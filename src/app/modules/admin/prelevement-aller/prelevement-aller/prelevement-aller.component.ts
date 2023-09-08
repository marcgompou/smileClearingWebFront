import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { WebsocketService } from 'app/core/websocket/websocket.service';
import { takeUntil, debounceTime, switchMap, map, Subject, merge, Observable, startWith } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
// import { MatDrawer } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';
import { FuseAlertType } from '@fuse/components/alert';
import { PrelevementAllerService } from '../prelevement-aller.service';


@Component({
  selector: 'app-prelevement-aller',
  templateUrl: './prelevement-aller.component.html',
  styleUrls: ['./prelevement-aller.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations
})




export class PrelevementAllerComponent implements OnInit, AfterViewInit, OnDestroy {
  // @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  drawerMode: 'side' | 'over';
  pageSizeOptions=[10,25];
  // montantTotal:number=0;
  // nombreCheque:number=0;
  // remiseIsInCorrect:boolean=true;
 


  totalRows = 0;
  pageSize = 10;
  currentPage = 0;
  
  /**Prelevement data */
  headerData:any= {};
  totalData:any={}
  detailsData:any[]=[]
  /**Prelevement data */

  /**MatTable */
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  @ViewChild('paginator') paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;
  /**MatTable */
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  showAlert: boolean = false;

  

  isLoading = false;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  scannerIsConnected = false;

  ficherPrelevement= new FormControl(null)

  prelevementForm = new FormGroup({

  })

   dataStructure = [
    { key: 'codeOperation', label: 'Code Operation' },
    { key: 'codeEnreg', label: 'Code Enreg' },
    { key: 'numLigne', label: 'Num. Ligne' },
    { key: 'dateEcheance', label: 'Date Echeance' },
    { key: 'banque', label: 'Banque' },
    { key: 'guichet', label: 'Guichet' },
    { key: 'compteDebite', label: 'Compte Débité' },
    { key: 'nomDebit', label: 'Nom Débit' },
    { key: 'nomBanque', label: 'Nom Banque' },
    { key: 'libelleOperat', label: 'Libellé Opérat' },
    { key: 'montant', label: 'Montant' }
  ];

  
  displayedColumns: string[] = ['codeOperation', 'codeEnreg', 'numLigne', 'dateEcheance', 'banque', 'guichet', 'compteDebite', 'nomDebit', 'nomBanque', 'libelleOperat', 'montant'];

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _formBuilder: UntypedFormBuilder,
    private _prelevementAllerService: PrelevementAllerService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router) {
  
  }




  

  //CYCLE DE VIE
  ngOnInit() {

  

  }


  

  closeAlert() {
    this.showAlert = false; // Définir showAlert à false pour masquer l'alerte lorsque l'utilisateur clique sur la croix
  }





  onBackdropClicked(): void {
    // Go back to the list
    this._router.navigate(['./'], { relativeTo: this._activatedRoute });

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }




  /**
   * After view init
   */
  ngAfterViewInit(): void {

    this.dataSource= new MatTableDataSource<any>([]);
    this.dataSource.paginator = this.paginator;
    this._changeDetectorRef.detectChanges();
  }

  selectedRow(row) {
    
  }


  onSubmit() { 


    //If form is valid
    this.detailsData=[]
  }
  

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      this.detailsData=[];
      // Now, you can read the file content or perform other operations with it.
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        const fileContent = e.target.result as string;
        const lines = fileContent.split('\n'); // Split the content into lines
        const totalLines = lines.length;
        for (let i = 0; i < totalLines; i++) {
          const line = lines[i];
          // CALL FUNCTION TO RETRIEVE THE HEADER
          if (i === 0) {
            this.extractHeaderValues(line);
          }
          //Details
          if(i>0 && i<totalLines-2){
            this.detailsData.push(this.extractDetails(line));
          }
          // CALL FUNCTION TO RETRIEVE THE LAST LINE 
          if (i === totalLines-2) {
            this.extractTotalData(line);
          }
        }
        if(this.detailsData.length>0){
          
          const startIndex = 0;
          const endIndex = 15;

          // Slice the data to display the current page
          this.dataSource.data = this.detailsData.slice(startIndex, endIndex);

          // Update the data source and total items
          
          this.totalRows=this.detailsData.length;
          console.log(this.detailsData);
        }
        this._changeDetectorRef.markForCheck();
        //console.log('File Content:', fileContent);
      };
      fileReader.readAsText(selectedFile);
    } else {
      console.error("No file selected.");
    }
  }

  getColumnHeaderText(column: string): string {
    //  console.log("column===>",column)
    let found = this.dataStructure.find(e => e.key == column);
    return found ? found.label : "";

  }



  loadData(pageSize: number, pageIndex: number) {
   

    // Calculate the start and end index based on the page size and page index
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;

    // Slice the data to display the current page
    const pageData = this.detailsData.slice(startIndex, endIndex);

    // Update the data source and total items
    this.dataSource.data = pageData;
    this.totalRows = this.detailsData.length;
  }

  onPageChange(event: PageEvent) {
    const { pageSize, pageIndex } = event;
    this.loadData(pageSize, pageIndex);
  }



  extractHeaderValues(headerLine: string) {
     this.headerData = {
      codeOperation: headerLine.substring(0, 2).trim(),
      codeEnreg: headerLine.substring(2, 3).trim(),
      numLigne: parseInt(headerLine.substring(3, 8).trim(), 10),
      dateEmission: headerLine.substring(8, 14).trim(),
      banque: headerLine.substring(14, 17).trim(),
      guichet: headerLine.substring(17, 22).trim(),
      compteCredite: headerLine.substring(22, 33).trim(),
      nom: headerLine.substring(33, 57).trim(),
      codeEmeteur: headerLine.substring(57, 62).trim(),
      dateOper: headerLine.substring(63, 69).trim(),
      zoneVide: headerLine.substring(69, 128).trim(),
    };
  
  }

  extractTotalData(data: string) {
    const codeOperation = data.substring(0, 2).trim();
    const codeEnreg = data.substring(2, 3).trim();
    const numLigne = data.substring(3, 8).trim() || null;
    const dateEmission = data.substring(8, 14).trim() || null;
    const zoneVide1 = data.substring(14, 22).trim();
    const compte = data.substring(22, 33).trim() || null;
    const zoneVide2 = data.substring(33, 108).trim();
    const montant =data.substring(104, 116).trim() || null;
    const zoneVide3 = data.substring(116, 128).trim();

    this.totalData= {
        codeOperation,
        codeEnreg,
        numLigne,
        dateEmission,
        zoneVide1,
        compte,
        zoneVide2,
        montant,
        zoneVide3,
    };

  }

  extractDetails(data: string) :{codeOperation,
      codeEnreg,numLigne,dateEcheance,
      banque,guichet,compteDebite,
      nomDebit,nomBanque,libelleOperat,
      montant,zoneVide,
  }{
        const codeOperation = data.substring(0, 2).trim();
        const codeEnreg = data.substring(2, 3).trim();
        const numLigne = parseInt(data.substring(3, 8).trim()) || null;
        const dateEcheance = data.substring(8, 14).trim() || null;
        const banque = data.substring(14, 17).trim();
        const guichet = data.substring(17, 22).trim();
        const compteDebite = data.substring(22, 33).trim();
        const nomDebit = data.substring(33, 57).trim();
        const nomBanque = data.substring(57, 74).trim() || null;
        const libelleOperat = data.substring(74, 104).trim();
        const montant = parseFloat(data.substring(104, 116).trim()) || null;
        const zoneVide = data.substring(116, 128).trim() || null;
        return  {
            codeOperation,
            codeEnreg,
            numLigne,
            dateEcheance,
            banque,
            guichet,
            compteDebite,
            nomDebit,
            nomBanque,
            libelleOperat,
            montant,
            zoneVide,
        };
  }







}
