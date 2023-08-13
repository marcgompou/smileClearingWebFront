import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'remise-aller',
    templateUrl    : './remise-aller.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemiseAllerComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }

    
}