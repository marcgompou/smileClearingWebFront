import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
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
import { DetailsComponent } from '../common/details/details/details.component';
import { DetailsModule } from '../common/details/details.module';
import { MatDialogModule } from '@angular/material/dialog';
import { FuseAlertModule } from '@fuse/components/alert';
import { traitementSalaireRoutes } from './traitement-salaire.routing';
import { DetailsTraitementSalaireComponent } from './traitement-salaire/details-traitement-salaire/details-traitement-salaire.component';
import { ListTraitementSalaireComponent } from './traitement-salaire/list-traitement-salaire/list-traitement-salaire.component';
import { TraitementSalaireComponent } from './traitement-salaire/traitement-salaire.component';



@NgModule({
  declarations: [
   TraitementSalaireComponent,
   //TransactionComponent,
   DetailsTraitementSalaireComponent,
   ListTraitementSalaireComponent,
  //  DetailsImprimerComponent,
  ],
  exports:[DetailsComponent],
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
        FuseAlertModule,
        RouterModule.forChild(traitementSalaireRoutes)

  ]
})
export class TraitementSalaireModule { }
