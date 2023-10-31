import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { Cheque } from '../../remise-aller/cheque.type';
import { ConfirmationUtilisateurServiceService } from '../confirmation-utilisateur.service';

@Component({
  selector: 'app-confirmation-utilisateur',
  templateUrl: './confirmation-utilisateur.component.html',
  styleUrls: ['./confirmation-utilisateur.component.scss']
})
export class ConfirmationUtilisateurComponent implements OnInit {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  public _confirmationMessage:string="";
  constructor(
    private _confirmationUtilisateurService:ConfirmationUtilisateurServiceService,
    private _changeDetectorRef: ChangeDetectorRef) { }

  
  ngOnInit(): void {
    this.getConfirmation();
  
  
  }





  getConfirmation(){

    this._confirmationUtilisateurService.getConfirmation$.pipe(takeUntil(this._unsubscribeAll)
    ).subscribe({
      next: (response) => {
        console.log("-------response------", response);
        this._confirmationMessage=response.message;
        this._changeDetectorRef.markForCheck();
      },
      error: (err) => {
        console.log(err);
        this._confirmationMessage="Echec lors de la confirmation du compte, le lien invalide";
      }
    });


  }

}
