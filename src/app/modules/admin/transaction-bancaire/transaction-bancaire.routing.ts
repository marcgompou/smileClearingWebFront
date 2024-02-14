import { Route } from '@angular/router';
//import { ValiderRemiseComponent } from './valider-remise/valider-remise/valider-remise.component';
//import { RemiseValiderComponent } from './valider-remise/valider-remise.component';
import { LoadDataResolver, LoadSansPaginationDataResolver } from '../common/table-data/table-data.resolver';
//import { DetailsRemiseComponent } from './details-remise/details-remise.component';
import { LoadDetailsResolver } from '../common/details/details.resolvers';
import { DetailsComponent } from '../common/details/details/details.component';
import { DetailsChequeComponent } from '../remise-aller/remise-aller/details-cheque/details-cheque.component';
import { DetailsTransactionComponent } from './transaction-bancaire/details-transaction/details-transaction.component';
import { ValiderTransactionComponent } from './transaction-bancaire/transaction-bancaire/transaction-bancaire.component';
import { TransactionValiderComponent } from './transaction-bancaire/transaction-bancaire.component';
import { LoadPrelevRemiseByIdResolver } from './transaction-bancaire/transaction-bancaire.resolver';

const endpoint = "detailsCompteAfb120";
const endpointDetails = "detailsCompteAfb120/details";

export const validerTransactionRoutes: Route[] =
[
    {
        path: '',
        component: TransactionValiderComponent,
        data: { breadcrumb: 'Liste', endpoint: endpoint },
        children: [
            {
                path: '',
                component: ValiderTransactionComponent,
                resolve: {
                    data: LoadSansPaginationDataResolver,

                },
            },
            {
                path: 'details/:id',
                component: DetailsTransactionComponent,
                resolve: {
                    dataDetails: LoadSansPaginationDataResolver, //LoadDataResolver
                    prelevRemise:LoadPrelevRemiseByIdResolver
                },
                data: { breadcrumb: 'Details transaction', endpoint: endpointDetails },

            }
        ]
    }
]
