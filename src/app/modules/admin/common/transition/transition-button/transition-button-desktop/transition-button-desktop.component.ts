import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';;
import { Subject, takeUntil } from 'rxjs';
import { Utils } from '../../../utils/utils';
import { TransitionConfirmationComponent } from '../../transition-confirmation/transition-confirmation.component';
import { Transition } from '../../transition.model';
@Component({
  selector: 'transition-buttons-desktop',
  templateUrl: './transition-button-desktop.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations
})
export class TransitionButtonDesktopComponent implements OnInit/*, AfterViewChecked*/ {

  @Input('transitions') transitions: Transition[];
  permissions: string[] = [];
  @Input('object') object: any;
  @Output() AfterExecutTransition = new EventEmitter<any>();

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    public _dialog:MatDialog,
    private _userService: UserService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseConfirmationService: FuseConfirmationService
  ) { }

  ngOnInit(): void {
    //get permissions
    this.getPermissions();
  }

  /*ngAfterViewChecked() {
    
  }*/

  enableBtn(transition:Transition):boolean{
    if(transition.role.toUpperCase().includes('VALIDATEUR')){
      return (this.object && this.permissions.includes(this.object?.validateurActuel));
    }else{
      return this.permissions.includes(transition.role);
    }
  }

  /**
   * Ouvir le formulaire de confirmation
   * @param transition 
   */
  openPopUpConfirm(transition:Transition): void {
    const confirmDialog = this._dialog.open(
        TransitionConfirmationComponent,
        {
          data: {
            object: this.object,
            transition: transition
          }
        }
    );
    confirmDialog.afterClosed().subscribe(resultat => {
      if (resultat && resultat.object_response) {
        this.AfterExecutTransition.emit(resultat.object_response);
        //NotifyDialog
        this.openNotifyDialog();
        this._changeDetectorRef.detectChanges();
      }
    });
  }


  /**
   * Recupérer les informations de l'utilisateur connecté
   */
  getPermissions(): void {
    // Subscribe to user changes
    this._userService.user$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((user: User) => {
        this.permissions = user.roles;
        // Mark for check
        this._changeDetectorRef.markForCheck();
    });
  }

  async openNotifyDialog(): Promise<void> {
    // Open the dialog and save the reference of it
    const notifyDialog = this._fuseConfirmationService.open(
      {
        "title": `<h1 class="mb-4 text-xl text-center font-extrabold tracking-tight leading-none text-gray-900 md:text-2xl lg:text-3xl dark:text-white"> Succès </h1>`,
        "message": `<span>Opération exécutée avec succès.</span>
                    <br>
                    <mat-icon class="icon-size-25" [color]="'primary'" [svgIcon]="'heroicons_outline:badge-check'"></mat-icon>`,
        "icon": {
          "show": true,
          "name": "heroicons_outline:exclamation",
          "color": "primary"
        },
        "actions": {
          "confirm": {
            "show": false,
            "label": "Remove",
            "color": "warn"
          },
          "cancel": {
            "show": false,
            "label": "Fermer"
          }
        },
        "dismissible": true
      }
    );

    await Utils.delay(1500);

    notifyDialog.close();
    
  }


}
