import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FuseAlertType } from '@fuse/components/alert';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Subject, takeUntil } from 'rxjs';
import { ValiderSalaireService } from '../valider-salaire.service';
import { TableDataService } from 'app/modules/admin/common/table-data/table-data.services';



@Component({
  selector: 'app-details-salaire',
  templateUrl: './details-salaire.component.html',
  styleUrls: ['./details-salaire.component.scss']
})
export class DetailsSalaireComponent implements OnInit {
  drawerMode: 'side' | 'over';
  salaireData: any;
  montantTotal: number = 0;
  nombreRemise: number = 0;
  canRelance: boolean = false;
  id: string = "";
  isLoading = false;
 
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  showAlert: boolean = false;
  public historiques = [
    {
      "id":"",
      "dateModification":"string",
      "emailUtilisateur":"string",
      "commentaire":"string",
      "etat":"string",
      "niveau":"number"
    },
    {
      "id":"",
      "dateModification":"string",
      "emailUtilisateur":"string",
      "commentaire":"string",
      "etat":"string",
      "niveau":"number"
    },
    {
      "id":"",
      "dateModification":"string",
      "emailUtilisateur":"string",
      "commentaire":"string",
      "etat":"string",
      "niveau":"number"
    }  
  ];
  

  public dataStructure = [
    
    {
      "key": "nomBeneficiaire",
      "label": "Nom Beneficiaire"
    },
    {
      "key": "domiciliation",
      "label": "Domiciliation"
    },
    {
      "key": "banque",
      "label": "Code Banque"
    },
    
    {
      "key": "guichet",
      "label": "Code banque"

    },
    {
      "key": "compte",
      "label": "Numero compte"
    },
    {
      "key": "cleRib",
      "label": "Cle Rib"

    },
    {
      "key": "libelle",
      "label": "Motif"

    },
   
    {
      "key": "montant",
      "label": "Montant",
      "type": "montant"

    },
    
  ];



  public displayedColumns: string[] = ["nomBeneficiaire","domiciliation","banque","guichet","compte","cleRib","libelle","montant"];
course: any;
trackByFn: any;


  

  goBackToList(): void {
    // Go back to the list
    this._router.navigate(['../../'], { relativeTo: this._activatedRoute });
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }


  constructor(private _changeDetectorRef: ChangeDetectorRef,
    private _validerSalaireService:ValiderSalaireService,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _tableDataService:TableDataService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router) {}

  ngOnInit(): void {
    //Recuperation de la ligne selectionner dans la liste des salaire de tableData common
    this._validerSalaireService.salaireRemise$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response)=>{
      console.log("------------------------------------------------------------->",response?.data) 
      this.salaireData=response?.data;
      this.montantTotal=response?.data?.montantTotal || 0;
     
    });
    this._tableDataService.datas$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response)=>{
      console.log("details salaire response=======>",response)
      let result:any=response;
      let findPrelevToRelance=result?.data?.findIndex((el) =>  el.statut==10||el.statut==40);//debit interdit et rejeté
      this.canRelance=findPrelevToRelance!=-1 && findPrelevToRelance!=null && findPrelevToRelance!=undefined;    
      console.log("canRelance===>",this.canRelance)
    });

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

  validerSalaire(){
    console.log("valider salaire id", this.salaireData);
    this._validerSalaireService.validerSalaire(this.salaireData.id).pipe().subscribe({
      next:(response)=>{
          console.log(response);
          this.goBackToList();
          this.showAlert = true;
      }
      
    });
  }
  AnnulerSalaire(){
    console.log("valider salaire id", this.salaireData);
    this._validerSalaireService.validerSalaire(this.salaireData.id).pipe().subscribe({
      next:(response)=>{
          console.log(response);
          this.goBackToList();
          this.showAlert = true;
      }
      
    });
  }

  telechargerSalaire(): void {
    
    this._validerSalaireService.telechargerRetourSalaire(this.salaireData.id).pipe().subscribe(blob => {
      // Create a temporary anchor element and trigger the download
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = this.salaireData.nomfichier+".emi"; // Set the desired file name
      console.log("statut prel",this.salaireData.statut);
      link.click();
    });
  }
  telechargerRelance(): void {
    this._validerSalaireService.telechargerRelance(this.salaireData.id).pipe().subscribe();
    
  }
  
  

}
