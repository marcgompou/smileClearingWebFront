import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'remise-importer',
    templateUrl    : './importer-remise.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemiseImporterComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }

    
}