import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'remise-valider',
    templateUrl    : './valider-remise.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemiseValiderComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }

    
}