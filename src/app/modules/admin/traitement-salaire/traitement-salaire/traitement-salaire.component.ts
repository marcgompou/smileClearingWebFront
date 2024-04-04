import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'salaire-traitement',
    templateUrl    : './traitement-salaire.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SalaireTraitementComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }

    
}