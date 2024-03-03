import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user:User
  _roleMap={
    VALID_PRELEVEMENT :"VALIDATION PRELEVEMENT",
    VALID_SALAIRE:"VALIDATION SALAIRE",
    CHARG_SALAIRE :"CHARGEMENT SALAIRE",
    CREATION:"CREATION REMISE",
    CHARG_PRELEVEMENT:"CHARGEMENT PRELEVEMENT",
    VALIDATION:'VALIDATION REMISE',
    ADMIN:"TRAITEMENT REMISE ET PRELEVEMEMT (ADMIN)",
    SUPERADMIN:"SUPER ADMINISTRATEUR",
    VISUALISATION:"VISUALISATION",
    EXPORTATION:"EXPORTATION",
    VALID_PRELEVEMENT_INTER_BANK:"VALIDATION PRELEVEMENT INTERBANK",
    CHARG_AFB120:"CHARGEMENT AFB120",
    CHARG_PRELEVEMENT_INTER_BANK:"CHARGEMENT PRELEVEMENT INTERBANK",
    CONSULT_SALAIRE:"CONSULTATION SALAIRE"
  }
  constructor(private _userService: UserService,private _router: Router) { }

  ngOnInit(): void {

    this._userService.user$.subscribe(user => {
      this.user = user;
    });
  }

}
