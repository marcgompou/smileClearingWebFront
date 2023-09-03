import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'remise-imprimer',
    templateUrl    : './imprimer-remise.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
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