import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoriqueRoutingModule } from './historique.routing';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { SharedModule } from 'app/shared/shared.module';
import { DetailsModule } from '../details/details.module';
import { TableDataModule } from '../table-data/table-data.module';
import { HistoriqueComponentComponent } from './historique-component/historique-component.component';


@NgModule({
  declarations: [
    HistoriqueComponentComponent
  ],
  imports: [
    CommonModule,
    HistoriqueRoutingModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDividerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatMomentDateModule,
    MatProgressBarModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatTableModule,
    MatStepperModule,
    MatTooltipModule,
    FuseFindByKeyPipeModule,
    SharedModule,
    TableDataModule,
    DetailsModule,
    MatAutocompleteModule,
    FuseAlertModule,
  ],
  exports:[
    HistoriqueComponentComponent
  ]
})
export class HistoriqueModule { }
