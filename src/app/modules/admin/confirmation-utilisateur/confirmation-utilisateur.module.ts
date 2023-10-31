import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationUtilisateurComponent } from './confirmation-utilisateur/confirmation-utilisateur.component';
import { RouterModule } from '@angular/router';
import { ConfirmationRoute } from './confirmation-utilisateur.routing';



@NgModule({
  declarations: [
    ConfirmationUtilisateurComponent
  ],
  imports: [
    RouterModule.forChild(ConfirmationRoute),
    CommonModule
  ]
})
export class ConfirmationUtilisateurModule { }
