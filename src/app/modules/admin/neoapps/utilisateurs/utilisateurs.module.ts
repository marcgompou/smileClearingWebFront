import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilisateursComponent } from './utilisateurs/utilisateurs.component';
import { ListComponent } from './utilisateurs/list/list.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { SharedModule } from 'app/shared/shared.module';
import { utilisateursRoutes } from 'app/modules/admin/neoapps/utilisateurs/utilisateurs.routing';
import { UtilisateursCreateComponent } from './utilisateurs/create/create.component';
import { FuseAlertModule } from '@fuse/components/alert';
import { DetailsModule } from '../../common/details/details.module';
import { TableDataModule } from '../../common/table-data/table-data.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UtilisateursComponent,
    ListComponent,
    UtilisateursCreateComponent,

  ],
  imports: [
    RouterModule.forChild(utilisateursRoutes),
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatMomentDateModule,
    MatProgressBarModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    FormsModule,
    TableDataModule,
    DetailsModule,
    MatSidenavModule,
    MatTableModule,
    MatTooltipModule,
    FuseFindByKeyPipeModule,
    SharedModule,
    FuseAlertModule,
  ]
})
export class UtilisateursModule { }





