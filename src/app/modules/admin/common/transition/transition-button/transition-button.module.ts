import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { TransitionConfirmationModule } from '../transition-confirmation/transition-confirmation.module';
import { TransitionButtonMobileComponent } from './transition-button-mobile/transition-button-mobile.component';
import { TransitionButtonDesktopComponent } from './transition-button-desktop/transition-button-desktop.component';
import { SharedModule } from 'app/shared/shared.module';



@NgModule({
  declarations: [
    TransitionButtonDesktopComponent,
    TransitionButtonMobileComponent
  ],
  imports: [

    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,

    MatProgressSpinnerModule,

    TransitionConfirmationModule,

    SharedModule
  ],
  exports:[
    TransitionButtonDesktopComponent,
    TransitionButtonMobileComponent
  ]
})
export class TransitionButtonModule { }
