import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'app-traitement-salaire',
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