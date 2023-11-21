import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserProfileRoutes } from './user-profile.routing';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    UserProfileComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(UserProfileRoutes),

  ]

})
export class UserProfileModule { }
