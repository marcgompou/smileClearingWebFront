import { Route } from '@angular/router';
import { LoadDataResolver, LoadSansPaginationDataResolver } from '../common/table-data/table-data.resolver';
import { DetailsTransactionComponent } from './transaction-bancaire/details-transaction/details-transaction.component';
import { TransactionComponent } from './transaction-bancaire/transaction-bancaire/transaction-bancaire.component';
import { TransactionBancaireComponent } from './transaction-bancaire/transaction-bancaire.component';
import { CompteEntreprisesAfb120Resolver,  LoadTransactionBancaireByIdResolver } from './transaction-bancaire/transaction-bancaire.resolver';

const endpoint = "detailsCompteAfb120";
const endpointDetails = "detailsCompteAfb120/details";

export const transactionRoutes: Route[] =
[
    {
        path: '',
        component: TransactionBancaireComponent,
        data: { breadcrumb: 'Liste', endpoint: endpoint },
        children: [
            {
                path: '',
                component: TransactionComponent,
                resolve: {
                    //data: LoadSansPaginationDataResolver,
                    data: LoadDataResolver,
                    compteEntreprise:CompteEntreprisesAfb120Resolver
                },
            },
            {
                path: 'details/:id',
                component: DetailsTransactionComponent,
                resolve: {
                    dataDetails: LoadSansPaginationDataResolver, //LoadDataResolver
                     //prelevRemise:LoadPrelevRemiseByIdResolver
                     TransacBancaire:LoadTransactionBancaireByIdResolver
                },
                data: { breadcrumb: 'Details transaction', endpoint: endpointDetails },

            }
        ]
    }
]
