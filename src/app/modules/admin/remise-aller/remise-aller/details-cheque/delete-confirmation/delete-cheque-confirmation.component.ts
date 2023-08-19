import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Utils } from 'app/modules/admin/common/utils/utils';
import { CreerRemiseService } from '../../remise.service';

@Component({
  selector: 'app-delete-cheque-confirmation',
  templateUrl: './delete-cheque-confirmation.component.html',
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class DeleteChequeConfirmationComponent {

  /** Alert */
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  showAlert: boolean = false;
  isLoading: boolean = false;

  constructor(
    private _creerRemiseService: CreerRemiseService,
    private _fuseConfirmationService: FuseConfirmationService,
    private _dialog: MatDialogRef<DeleteChequeConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: 
    { 
      id:any
      cheques:any[];
      endpoint:string|null;
    },
  ) { }

  closeModal(): void {
    this._dialog.close();
  }

  supprimer():void{
    // Hide the alert
    this.showAlert = false;
    this.isLoading = true;

    if(this.data.endpoint){
     //DELETE WITH ENDPOINT FOR CHEQUE
     this._creerRemiseService.delete(this.data.id,this.data.endpoint).subscribe({
      next: (response) => {
          this.alert = {
            type: 'success',
            message: "Supprimession effectué."
          };
          this.showAlert = true;
          this.isLoading = false;
          this._dialog.close({isDeleted:true});
          //NotifyDialog
          this.openNotifyDialog();

        },error: (error) => {
          console.error('Error : ', JSON.stringify(error));
          // Set the alert
          this.alert = { type: 'error', message: error.error.message??error.error };
          // Show the alert
          this.showAlert = true;
          this.isLoading = false;
        }
      });

    }
    else{ 
      //FOR LOCAL DELETE
      console.log("cheque data",this.data.cheques)
      console.log("id",this.data.id);
      const deleteResult=this.data.cheques.filter((el,index)=>{return index!=this.data.id})
      this._creerRemiseService.updateDataTable(deleteResult);
    }

    this.alert = {
      type: 'success',
      message: "Supprimession effectuée."
    };
    this.showAlert = true;
    this.isLoading = false;
    this._dialog.close({isDeleted:true});

    //NotifyDialog
    this.openNotifyDialog();
  }

  async openNotifyDialog(): Promise<void> {
    // Open the dialog and save the reference of it
    const notifyDialog = this._fuseConfirmationService.open(
      {
        "title": `<h1 class="mb-4 text-xl text-center font-extrabold tracking-tight leading-none text-gray-900 md:text-2xl lg:text-3xl dark:text-white"> Succès </h1>`,
        "message": `<span>Suppression réussie.</span>
                    <br>
                    <mat-icon class="icon-size-25" [color]="'primary'" [svgIcon]="'heroicons_outline:badge-check'"></mat-icon>`,
        "icon": {
          "show": true,
          "name": "heroicons_outline:exclamation",
          "color": "primary"
        },
        "actions": {
          "confirm": {
            "show": false,
            "label": "Remove",
            "color": "warn"
          },
          "cancel": {
            "show": false,
            "label": "Fermer"
          }
        },
        "dismissible": true
      }
    );

    await Utils.delay(1500);

    notifyDialog.close();
    
  }

}
