import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'app-traitement-prelevement',
    templateUrl    : './traitement-prelevement.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TraitementPrelevementComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }

    
}