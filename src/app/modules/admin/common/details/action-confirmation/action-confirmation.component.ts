import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Utils } from 'app/modules/admin/common/utils/utils';
import { DetailsService } from '../details.service';


@Component({
  selector: 'app-confirmation-confirmation',
  templateUrl: './action-confirmation.component.html',
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class ActionConfirmationComponent {

  /** Alert */
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  showAlert: boolean = false;
  isLoading: boolean = false;

  constructor(
    private _detailsService: DetailsService,
    private _dialog: MatDialogRef<ActionConfirmationComponent>,
    private _fuseConfirmationService: FuseConfirmationService,
    @Inject(MAT_DIALOG_DATA) public data: 
    { 
      id:any
      endpoint?:string,
      title?:string
      action?:any,
      payload?:any,
      actionType:'update'|'delete'
    },
  ) { }

  closeModal(): void {
    this._dialog.close();
  }

  handleResponse(response: any): void {
    this.alert = {
      type: 'success',
      message: response?.message || "Opération effectuée."
    };
    this.showAlert = true;
    this.isLoading = false;
    this._dialog.close({ actionExecuted: true });
    this.openNotifyDialog();
  }
  
  handleError(error: any): void {
    console.error('Error : ', JSON.stringify(error));
    this.alert = { type: 'error', message: error.error?.message || error.error };
    this.showAlert = true;
    this.isLoading = false;
  }


  runAction():void{
    // Hide the alert
    this.showAlert = false;
    this.isLoading = true;

      if(this.data.actionType=='delete'){
        //Call service in details service
        this._detailsService.delete(this.data.id,this.data.endpoint).subscribe({
          next: (response) => {
            this.handleResponse(response);
          },
          error: (error) => {
            this.handleError(error);
          }
        })
      }
      if(this.data.actionType=='update'){
        console.log(this.data.action);
        this._detailsService.update(this.data.id,this.data.endpoint,this.data.payload).subscribe({
          next: (response) => {
            this.handleResponse(response);
          },
          error: (error) => {
            this.handleError(error);
          }
        });
      }
      
    
    
  }

  async openNotifyDialog(): Promise<void> {
    // Open the dialog and save the reference of it
    const notifyDialog = this._fuseConfirmationService.open(
      {
        "title": `<h1 class="mb-4 text-xl text-center font-extrabold tracking-tight leading-none text-gray-900 md:text-2xl lg:text-3xl dark:text-white"> Succès </h1>`,
        "message": `<span>Operation effectuée avec succès.</span>
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
            "label": "Executer",
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
