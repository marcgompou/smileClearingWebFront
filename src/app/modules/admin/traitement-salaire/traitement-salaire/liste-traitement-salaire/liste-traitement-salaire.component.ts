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
  selector: 'app-liste-traitement-salaire',
  templateUrl: './liste-traitement-salaire.component.html',
  styleUrls: ['liste-traitement-salaire.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations
})


export class ListeTraitementSalaireComponent implements OnInit, OnDestroy {

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
      "key": "nomFichier",
      "label": "Nom Fichier"
    },
    {
      "key": "nomEntreprise",
      "label": "Nom Entreprise"
    },

   
    {
      "key": "codeAgence",
      "label": "Code Agence"
    },
    {
      "key": "numeroCompte",
      "label": "Numero Compte"

    },
    
    {
      "key": "nombreVirement",
      "label": "Nombre Virement"

    },
    {
      "key": "montantTotal",
      "label": "Montant Total"

    },
    {
      "key": "dateEnregistrement",
      "label": "Date Enregistrement",
      "type": "date"
    },
    {
      "key": "dateEcheance",
      "label": "Date Echeance",
      "type": "date"
    },

    {
      "key": "niveauValidation",
      "label": "Niveau Validation",
     
    },

    

  ];

  public displayedColumns: string[] = ['nomFichier', 'nomEntreprise', 'codeAgence', 'numeroCompte', 'nombreVirement', 'montantTotal','dateEnregistrement', 'dateEcheance','niveauValidation'];

  isLoading = false;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  _filterObject:any={criteria:""};
  statutSalaireForm = new FormGroup({
    statut: new FormControl('', Validators.required),

  })





  //CYCLE DE VIE
  ngOnInit() {


  

    this.statutSalaireForm = this._formBuilder.group({
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
    this._filterObject={ criteria: this.criteria ,statut:this.statutSalaireForm.get('statut').value};
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
    // private _salaireService: TraitementSalaireService,
    private _activatedRoute: ActivatedRoute,
    private _tableDataService: TableDataService,
    private _router: Router,
    // private _traitementSalaireService: TraitementSalaireService,


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


  

  //recherche les salaire selon le statut
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
    this._filterObject.statut=this.statutSalaireForm.get('statut').value;
    this._tableDataService._endpoint = `salaires/admin`;
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
