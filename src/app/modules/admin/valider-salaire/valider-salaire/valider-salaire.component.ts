import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'salaire-valider',
    templateUrl    : './valider-salaire.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SalaireValiderComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }

    
}