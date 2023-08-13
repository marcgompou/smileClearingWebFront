import { NgModule } from '@angular/core';
import { HistoriqueComponent } from './historique.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/shared/shared.module';
import { TransitionConfirmationModule } from '../transition/transition-confirmation/transition-confirmation.module';
import { FuseAlertModule } from '@fuse/components/alert';
import { MatRippleModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { TimeLineComponent } from './time-line/time-line.component';


@NgModule({
  declarations: [
    HistoriqueComponent,
    TimeLineComponent
  ],
  imports: [

    MatInputModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatRippleModule,
    MatSortModule,
    MatSelectModule,
    MatSidenavModule,
    MatTableModule,

    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    FuseAlertModule,
    MatProgressSpinnerModule,

    TransitionConfirmationModule,

    SharedModule
  ],
  exports: [
    HistoriqueComponent,
    TimeLineComponent
  ]
})
export class HistoriqueModule { }
