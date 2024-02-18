import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'transaction-valider',
    templateUrl    : './transaction-bancaire.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
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