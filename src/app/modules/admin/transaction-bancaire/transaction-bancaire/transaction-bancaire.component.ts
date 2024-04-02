import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector       : 'transaction-valider',
    templateUrl    : './transaction-bancaire.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class TransactionBancaireComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }

    
}