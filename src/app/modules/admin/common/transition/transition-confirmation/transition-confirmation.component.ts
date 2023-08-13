import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm, UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { Transition } from '../transition.model';
import { TransitionService } from '../transition.services';

@Component({
  selector: 'transition-confirmation',
  templateUrl: './transition-confirmation.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TransitionConfirmationComponent implements OnInit {

  @ViewChild('transitionNgForm') transitionNgForm: NgForm;

  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  transitionForm: UntypedFormGroup;
  showAlert: boolean = false;
  isLoading: boolean = false;

  constructor(
    private _transitionsService: TransitionService,
    private _dialog: MatDialogRef<TransitionConfirmationComponent>,
    private _formBuilder: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { object: any, transition: Transition }
  ) { }

  ngOnInit(): void {
    this.transitionForm = this._formBuilder.group({
      decision: [this.data.transition.decision, [Validators.required]],
      commentaire: [null, [Validators.maxLength(150), Validators.minLength(2)]]
    });
  }

  closeModal(): void {
    this._dialog.close();
  }

  executerTranstion():void{
    if (this.transitionForm.invalid) {
      return;
    }

    // Hide the alert
    this.showAlert = false;
    this.isLoading = true;

    this._transitionsService.executerTransition(
      this.data.object.id,this.data.transition,this.transitionForm.value.decision,this.transitionForm.value.commentaire
    ).subscribe({
      next: (response) => {
        this.alert = {
          type: 'success',
          message: `Opération réussie.`
        };
        this.showAlert = true;
        this.isLoading = false;

        //close confirm
        this._dialog.close({object_response:response});
       
      }, error: (error) => {
        console.error('Error : ', JSON.stringify(error));
        // Set the alert
        this.alert = { type: 'error', message: error.error.message??error.error};
        // Show the alert
        this.showAlert = true; 
        this.isLoading = false; 
      }
    });
  }

}
