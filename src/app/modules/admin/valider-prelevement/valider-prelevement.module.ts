import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValiderPrelevementComponent } from './valider-prelevement/valider-prelevement/valider-prelevement.component';
import { RouterModule } from '@angular/router';
import { validerPrelevementRoutes } from './valider-prelevement.routing';
import { SharedModule } from 'app/shared/shared.module';
import { StatusComponent } from '../common/status/status.component';
import { PrelevementValiderComponent } from './valider-prelevement/valider-prelevement.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { TableDataModule } from '../common/table-data/table-data.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DetailsPrelevementComponent } from './valider-prelevement/details-prelevement/details-prelevement.component';
import { DetailsComponent } from '../common/details/details/details.component';
import { DetailsModule } from '../common/details/details.module';
import { MatDialogModule } from '@angular/material/dialog';
import { DetailsImprimerComponent } from '../imprimer-remise/details-importation/details-imprimer.component';



@NgModule({
  declarations: [
    ValiderPrelevementComponent,
    PrelevementValiderComponent,
   DetailsPrelevementComponent,
  //  DetailsImprimerComponent,
  ],
  exports:[DetailsPrelevementComponent],
  imports: [
    CommonModule,
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
        MatTooltipModule,
        FuseFindByKeyPipeModule,
        SharedModule,
        TableDataModule,
        DetailsModule,
        MatAutocompleteModule,
        RouterModule.forChild(validerPrelevementRoutes)

  ]
})
export class PrelevementValiderModule { }