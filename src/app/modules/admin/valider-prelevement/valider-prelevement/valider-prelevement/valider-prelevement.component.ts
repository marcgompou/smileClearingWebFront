import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators, FormGroup, FormControl } from '@angular/forms';

import { 
  Subject, 
} from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { MatSelectChange } from '@angular/material/select';
import { TableDataService } from 'app/modules/admin/common/table-data/table-data.services';

@Component({
  selector: 'app-valider-prelevement',
  templateUrl: './valider-prelevement.component.html',
  styleUrls: ['valider-prelevement.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations
})


export class ValiderPrelevementComponent implements OnInit, OnDestroy {
 
  montantTotal: number = 0;
  statut: string = "0";
 
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
      "label": "Code Agence"
    },
    {
      "key": "compteCredite",
      "label": "Compte crédité"
    },
    {
      "key": "nbPrelevement",
      "label": "Nombre Prelevement"

    },
    {
      "key": "mtTotal",
      "label": "Montant Total"

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

  statutPrelevementForm = new FormGroup({
    statut: new FormControl('', Validators.required),
  })

  public _filterObject: {  statut: string;   nomFichier?:string};

  //CYCLE DE VIE
  ngOnInit() {
      //Definir la valeur par defaut du statut
      this.statutPrelevementForm = this._formBuilder.group({
          statut: ['1']
      });
      this._tableDataService.datas$.subscribe((res:any) => {
      const prelevementList=res.data as any[];
      try{
        this.montantTotal=prelevementList.reduce((a, b) => a + b.mtTotal, 0);
      }catch(e){
      }
    });

    // Subscribe to search input field value changes
    // this.searchInputControl.valueChanges
    //   .pipe(
    //     takeUntil(this._unsubscribeAll),
    //     debounceTime(300),
    //     switchMap((query) => {
    //       // this.closeDetails();
    //       this.isLoading = true;
    //       return null;
    //     }),
    //     map(() => {
    //       this.isLoading = false;
    //     })
    //   )
    //   .subscribe();
    //   this.statutPrelevementForm = this._formBuilder.group({
    //     statut: ['1']
    //     //mySelect: ['option2'] // Set the default value here
    //   });
  }

  constructor( private _formBuilder: UntypedFormBuilder,private _tableDataService:TableDataService,) { }

  onSelectChange(event: MatSelectChange) {
  
      this.statut = event.value?event.value:"0";
      console.log('Valeur sélectionnée :', this.statut);
      this._filterObject = { statut: this.statut,};
      this.onFilterChange(this._filterObject); //On transmet la nouvelle valeur du filtre
  }

  //Permet de transmettre la nouvelle valeur du filtre dans le composant parent
  onFilterChange(newFilter: any) {
    // Réagir aux changements de filtre
    console.log('Le filtre a changé dans le composant enfant : ', newFilter);
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
