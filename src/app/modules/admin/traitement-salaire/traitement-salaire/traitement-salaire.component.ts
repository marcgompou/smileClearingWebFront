import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'traitement-salaier',
    templateUrl    : './traitement-salaire.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TraitementSalaireComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }

    
}