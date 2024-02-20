import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'prelevement-valider',
    templateUrl    : './valider-prelevement-interbancaire.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrelevementValiderInterbancaireComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }

    
}