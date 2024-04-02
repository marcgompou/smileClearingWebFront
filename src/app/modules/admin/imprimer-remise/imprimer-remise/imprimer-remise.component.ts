import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector       : 'remise-imprimer',
    templateUrl    : './imprimer-remise.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class RemiseImprimerComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }

    
}