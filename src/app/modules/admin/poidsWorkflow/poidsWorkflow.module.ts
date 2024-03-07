import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompteAfbComponent } from './compteAfb/compteAfb.component';
import { ListAfbComponent } from './compteAfb/list/list.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DATE_FORMATS, MatRippleModule } from '@angular/material/core';
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
//import * as moment from 'moment';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { SharedModule } from 'app/shared/shared.module';
import { compteAfbRoutes } from 'app/modules/admin/compteAfb120/compteAfb.routing';
import { TableDataModule } from "../common/table-data/table-data.module";
import { CreateModule } from "../common/create/create.module";
import { DetailsComponent } from '../common/details/details/details.component';
import { DetailsModule } from '../common/details/details.module';


@NgModule({
    declarations: [
        CompteAfbComponent,
        ListAfbComponent,
        
    ],
    imports: [
        RouterModule.forChild(compteAfbRoutes),
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
        DetailsModule
    ]
})
export class CompteAfbModule { }





