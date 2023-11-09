import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsComponent } from './details/details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { FuseAlertModule } from '@fuse/components/alert';
import { MatDialogModule } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from './delete-confirmation/delete-confirmation.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatMenuModule } from '@angular/material/menu';
import { ActionConfirmationComponent } from './action-confirmation/action-confirmation.component';



@NgModule({
  declarations: [
    DetailsComponent,
    ActionConfirmationComponent,

    DeleteConfirmationComponent
  ],
  imports: [
    CommonModule,
    MatTooltipModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    FuseAlertModule, //NON REUTILISABLE DANS UN AUTRE PROJET
    MatDialogModule,
    MatMenuModule,
    MatMomentDateModule

  ],
 
  entryComponents: [
    DeleteConfirmationComponent,
    ActionConfirmationComponent,

  ],
  exports:[
    DetailsComponent,
    DeleteConfirmationComponent,
    ActionConfirmationComponent

  ]
  
})
export class DetailsModule { }

