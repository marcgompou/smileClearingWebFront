import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FuseAlertType } from '@fuse/components/alert';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Subject, takeUntil } from 'rxjs';
import { TraitementSalaireService } from '../traitement-salaire.service';
import { TableDataService } from 'app/modules/admin/common/table-data/table-data.services';
import { fuseAnimations } from '@fuse/animations';
import { HttpClient, HttpResponse } from '@angular/common/http';



@Component({
  selector: 'app-details-salaire',
  templateUrl: './details-salaire.component.html',
  animations     : fuseAnimations,
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
  totalStepsSalaire : number = 0;
  historiques: any[] = [];
 
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  showAlert: boolean = false;
  public nomFichier: string = "-";

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
  historique: any;
  validators: any;
  


  

  goBackToList(): void {
    // Go back to the list
    this._router.navigate(['../../'], { relativeTo: this._activatedRoute });
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }


  constructor(private _changeDetectorRef: ChangeDetectorRef,
    private _traitementSalaireService:TraitementSalaireService,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _tableDataService:TableDataService,
    private _activatedRoute: ActivatedRoute,
    private _httpClient: HttpClient,
    private _router: Router) {}


  ngOnInit(): void {
    //Recuperation de la ligne selectionner dans la liste des salaire de tableData common
    this._traitementSalaireService.salaireRemise$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response)=>{
      console.log("------------------------------------------------------------->",response?.data) 
      this.salaireData=response?.data;
      this.montantTotal=response?.data?.montantTotal || 0;
     
    });
    this.getHistoriqueSalaire(); 
   
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

  traitementSalaire() {
    console.log("traitement salaire id", this.salaireData);
    this._traitementSalaireService.traitementSalaire(this.salaireData.id).subscribe({
      next: (response) => {
          console.log(response);
          this.goBackToList();
          this.showAlert = true;
      },
      error: (error) => {
          console.error('Une erreur s\'est produite :', error);
          // Gérer l'erreur ici (affichage d'un message d'erreur, journalisation, etc.)
      }
    });
}

telechargerSalaireValider(url: string,id): void {
    // Vérifier si l'id est défini
    if (!this.id) {
      console.error("L'identifiant est requis pour télécharger le salaire.");
      return; // Arrêter l'exécution si l'ID est manquant
    }
  
    this._traitementSalaireService.telechargerSalaireValider(this.id).subscribe({
      next: ({ blob, fileName }) => {
        // Créer un élément d'ancrage temporaire pour déclencher le téléchargement
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
      },
      error: (error: any) => {
        console.error("Une erreur s'est produite lors du téléchargement du salaire :", error);
        // Gérer l'erreur ici, par exemple afficher un message à l'utilisateur
      }
    });

}

//  telechargerSalaire(): void {
  
//    this._traitementSalaireService.telechargerSalaireValider(this.id).pipe().subscribe(blob => {
//      // Create a temporary anchor element and trigger the download
//      const link = document.createElement('a');
//      link.href = window.URL.createObjectURL(blob);
//      link.download =  this.nomFichier+".rec"; // Set the desired file name
//      link.click();
//    });
//  }

  AnnulerSalaire(){
    console.log("traitement salaire id", this.salaireData);
    this._traitementSalaireService.traitementSalaire(this.salaireData.id).pipe().subscribe({
      next:(response)=>{
          console.log(response);
          this.goBackToList();
          this.showAlert = true;
      }
      
    });
  }

  getHistoriqueSalaire(){
    this._traitementSalaireService.suiviSalaire$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response)=>{
      console.log("historique salaire", response)
      let result:any=response;
      this.historiques=result.data.historiques;
      this.validators=result.data.validators;
     this.totalStepsSalaire = result.data.validators.length + result.data.historiques.length;
      console.log("totalSteps===>",this.totalStepsSalaire)
      this._changeDetectorRef.markForCheck();
    })
  } 

  
  telechargerSalaire(): void {
    
    this._traitementSalaireService.telechargerRetourSalaire(this.salaireData.id).pipe().subscribe(blob => {
      // Create a temporary anchor element and trigger the download
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = this.salaireData.nomfichier+".emi"; // Set the desired file name
      console.log("statut prel",this.salaireData.statut);
      link.click();
    });
  }
  telechargerRelance(): void {
    this._traitementSalaireService.telechargerRelance(this.salaireData.id).pipe().subscribe();
    
  }
  
  

}
