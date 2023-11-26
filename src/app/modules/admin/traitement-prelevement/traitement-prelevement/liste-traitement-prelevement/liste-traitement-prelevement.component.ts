import {  ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators, FormGroup, FormControl } from '@angular/forms';
// import { MatPaginator } from '@angular/material/paginator';
// import { MatSort } from '@angular/material/sort';
import { takeUntil, debounceTime, switchMap, map, Subject, distinctUntilChanged, filter } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';
import { FuseAlertType } from '@fuse/components/alert';
import { MatSelectChange } from '@angular/material/select';
import { TableDataService } from 'app/modules/admin/common/table-data/table-data.services';
//import {img} from './image';

@Component({
  selector: 'app-liste-traitement-prelevement',
  templateUrl: './liste-traitement-prelevement.component.html',
  styleUrls: ['liste-traitement-prelevement.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations
})


export class ListeTraitementPrelevementComponent implements OnInit, OnDestroy {

  statut: string = "0";
  criteria="";

  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;
  private _searchTerms = new Subject<string>();

  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  showAlert: boolean = false;

  public dataStructure = [



    {
      "key": "codeEmetteur",
      "label": "Code emetteur"
    },
    {
      "key": "nomfichier",
      "label": "Nom fichier"
    },

    {
      "key": "codeagence",
      "label": "Code agence"
    },
    {
      "key": "compteCredite",
      "label": "Compte crédite"
    },
    {
      "key": "nbPrelevement",
      "label": "Nombre prelevement"

    },
    {
      "key": "mtTotal",
      "label": "Montant total"

    },
    {
      "key": "dateEdition",
      "label": "Date edition",
      "type": "date"
    },

    {
      "key": "dateEngistrement",
      "label": "Date engistrement",
      "type": "date"
    },


  ];

  public displayedColumns: string[] = ['codeEmetteur', 'nomfichier', 'codeagence', 'compteCredite', 'nbPrelevement', 'mtTotal', 'dateEdition', 'dateEngistrement'];

  isLoading = false;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  _filterObject:any={criteria:""};
  statutPrelevementForm = new FormGroup({
    statut: new FormControl('', Validators.required),

  })





  //CYCLE DE VIE
  ngOnInit() {


  

    this.statutPrelevementForm = this._formBuilder.group({
      statut: ['3']
    });

    // Subscribe to MatDrawer opened change
   


  this._searchTerms
.pipe(
  debounceTime(300), // Adjust the debounce time (in milliseconds) as needed
  distinctUntilChanged(),
  // Ignore if the new term is the same as the previous term
  filter((term: string) => !(term.startsWith('[') && !term.endsWith(']'))), // Filter out undesired terms
  switchMap((term: string) => {
    this.criteria=term;
    this._filterObject={ criteria: this.criteria ,statut:this.statutPrelevementForm.get('statut').value};
    // // this._tableDataService._filterObject = this._filterObject
    // // this._tableDataService._hasPagination = true;
    // // this._tableDataService._paginationObject = {
    // //   page: 0,
    // //   size: 10
    // // };
    this.filtering();
    return this._tableDataService.getDatas();
  })
)
.subscribe(() => {
  // Perform any additional actions after the data is retrieved.
  this._changeDetectorRef.detectChanges();
});

  }
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _formBuilder: UntypedFormBuilder,
    // private _prelevementService: TraitementPrelevementService,
    private _activatedRoute: ActivatedRoute,
    private _tableDataService: TableDataService,
    private _router: Router,
    // private _traitementPrelevementService: TraitementPrelevementService,


  ) {



  }

  applyFilter(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this._searchTerms.next(query);
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


  

  //recherche les prelevement selon le statut
  onSelectChange(event: MatSelectChange) {
    this.statut = event.value ? event.value : "0";
    console.log('Valeur sélectionnée :', this.statut);
    this._filterObject={ criteria: this.criteria ,statut:event.value};
    this.filtering();
    //this._tableDataService.getDatasByPath().subscribe();
    this._tableDataService.getDatas().subscribe();
    this._changeDetectorRef.markForCheck();
  }


  filtering(): void {
    this._filterObject.statut=this.statutPrelevementForm.get('statut').value;
    this._tableDataService._endpoint = `prelevement/admin`;
    this._tableDataService._filterObject = this._filterObject
    this._tableDataService._hasPagination = true;
    this._tableDataService._paginationObject = {
      page: 0,
      size: 10
    };
  }


  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }




}
