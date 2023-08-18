import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseAlertType } from '@fuse/components/alert';
import { Remise } from '../remise.type';
import { DetailsChequeComponent } from '../../remise-aller/remise-aller/details-cheque/details-cheque.component';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CreerRemiseService } from '../../remise-aller/remise-aller/remise.service';
import { TableDataService } from '../../common/table-data/table-data.services';

@Component({
  selector: 'app-details-remise',
  templateUrl: './details-remise.component.html',
  styleUrls: ['./details-remise.component.scss']
})
export class DetailsRemiseComponent implements OnInit {
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  drawerMode: 'side' | 'over';
  noData: any;
  remiseData: any;
  montantTotal: number = 0;
  nombreRemise: number = 0;
  remiseIsInCorrect: boolean = true;
  id: string = "";
  isLoading = false;


  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;


  action = 'CONNECT';
  received: Remise[] = [];
  totalRows = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 25];

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  chequeData: any;
  showAlert: boolean = false;


  public dataStructure = [
    {
      "key": "numChq",
      "label": "Numero de cheque"
    },
    {
      "key": "codeBanque",
      "label": "Code banque"
    },
    {
      "key": "titulaire",
      "label": "Titulaire"

    },
    {
      "key": "agence",
      "label": "Code agence"

    },
    {
      "key": "cleRib",
      "label": "Clé RIB"

    },
    {
      "key": "montant",
      "label": "Montant"

    },


  ];



  public displayedColumns: string[] = ["numChq","codeBanque","titulaire","agence","cleRib","montant",];


  onBackdropClicked(): void {
    // Go back to the list
    this._router.navigate(['./'], { relativeTo: this._activatedRoute });

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }


  getColumnHeaderText(column: string): string {
    //  console.log("column===>",column)
    let found = this.dataStructure.find(e => e.key == column);
    return found ? found.label : "";
  }

  constructor(private _changeDetectorRef: ChangeDetectorRef,
    private _formBuilder: UntypedFormBuilder,
    private _chequeService: CreerRemiseService,
    private _tableDataService: TableDataService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router) {


  }

  ngOnInit(): void {

    this._tableDataService.data$.pipe().subscribe((response)=>{
      console.log("details cheque remise response=======>",response)
      this.chequeData=response;
    })
    this._activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      console.log("id in details", this.id);
    })
  }





  openDetailComponent(component: DetailsChequeComponent) {
    component.matDrawer = this.matDrawer;
    // component.endpoint = "compteClient";
    component.formTitle = "CHEQUE";
    component.chequeData = this.chequeData;
    //Initialisation formulaire details
    component.formFields = [
      {
        key: "numChq",
        libelle: "N° de Cheque",
        validators: {
          min: 7,
          max: 7,
          required: true
        }
      },
      {
        key: "codeBanque",
        libelle: "Code Banque",
        placeholder: "Ex: CI131",
        validators: {
          min: 5,
          max: 5,
          required: true,
        }
      },
      {
        key: "agence",
        libelle: "Code Agence",
        placeholder: "Ex: 01001",
        validators: {
          min: 5,
          max: 5,
          required: true
        }
      },

      // {
      //   key: "compte",
      //   libelle: "Compte",
      //   validators: {
      //     min: 12,
      //     max: 12,
      //     required: true
      //   }
      // },
      {
        key: "cleRib",
        libelle: "Cle Rib",
        validators: {
          min: 2,
          max: 50,
          required: true
        }
      },
      {
        key: "montant",
        libelle: "Montant",
        type: "number",
        validators: {
          minValue: 1000,
          min: 1,
          max: 11,
          required: true
        }
      },
      {
        key: "titulaire",
        libelle: "Titulaire",
        validators: {
          max: 50
        }
      }
    ]
  }

}
