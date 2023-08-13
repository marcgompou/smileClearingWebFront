import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreerRemiseComponent } from './remise-aller/creer-remise/creer-remise.component';
import { ValiderRemiseComponent } from './remise-aller/valider-remise/valider-remise.component';
import { DetailsChequeComponent } from './remise-aller/details-cheque/details-cheque.component';
import { RouterModule } from '@angular/router';
import { remiseRoutes } from './remise-aller.routing';
import { SharedModule } from 'app/shared/shared.module';
import { StatusComponent } from '../common/status/status.component';
import { RemiseAllerComponent } from './remise-aller/remise-aller.component';
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
import { CreateModule } from '../common/create/create.module';
import { DetailsModule } from '../common/details/details.module';
import { TableDataModule } from '../common/table-data/table-data.module';



@NgModule({
  declarations: [
    CreerRemiseComponent,
    RemiseAllerComponent,
    ValiderRemiseComponent,
    DetailsChequeComponent,
    StatusComponent
  ],
  imports: [
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
        MatSidenavModule,
        MatTableModule,
        MatTooltipModule,
        FuseFindByKeyPipeModule,
        SharedModule,
        TableDataModule,
        CreateModule,
        DetailsModule,
    
    RouterModule.forChild(remiseRoutes)

  ]
})
export class RemiseAllerModule { }
