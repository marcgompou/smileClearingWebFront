import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
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
  noData: any;
  chequeData: any;
  listeCompteEntreprise: any[] = [];
  montantTotal:number=0;
  nombreCheque:number=0;
  remiseIsInCorrect:boolean=true;
  //listeCompteEntreprise: any;
  enregistrerRemise() {
    throw new Error('Method not implemented.');
  }
  selectedProject: string = 'ACME Corp. Backend App';

  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;

  totalRows = 0;
  pageSize = 10;
  currentPage = 0;
  /**Prelevement data */
  headerData:any= {};
  totalData:any={}
  /**Prelevement data */

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

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
    this._changeDetectorRef.detectChanges();
  }

  onSubmit() { }
  

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
      // Now, you can read the file content or perform other operations with it.
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        const fileContent = e.target.result as string;
        const lines = fileContent.split('\n'); // Split the content into lines
        const totalLines = lines.length;
        for (let i = 0; i < totalLines; i++) {
          const line = lines[i];
          console.log(`Line ${i + 1} of ${totalLines}:`, line); // Log line number and content
          // CALL FUNCTION TO RETRIEVE THE HEADER
          if (i === 0) {
            this.extractHeaderValues(line);
            console.log(this.headerData);
          }

          if(i>0 && i<totalLines){
          }


          // CALL FUNCTION TO RETRIEVE THE LAST LINE 
          if (i === totalLines - 1) {
            console.log(i)
            this.extractTotalData(line);
          
          
          }

        }
        this._changeDetectorRef.markForCheck();



        //console.log('File Content:', fileContent);
      };
      fileReader.readAsText(selectedFile);
    } else {
      console.error("No file selected.");
    }
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
    const codeOperation = data.substring(0, 2);
    const codeEnreg = data.substring(2, 3);
    const numLigne = parseInt(data.substring(3, 8));
    const dateEmission = data.substring(8, 14);
    const zoneVide1 = data.substring(14, 22).trim();
    const compte = parseInt(data.substring(22, 33));
    const zoneVide2 = data.substring(33, 108).trim();
    const montant = parseInt(data.substring(104, 116));
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
    console.log("this.totalData=======>",this.totalData);
  }

}
