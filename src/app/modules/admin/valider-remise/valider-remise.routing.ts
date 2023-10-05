import { Route } from '@angular/router';
import { ValiderRemiseComponent } from './valider-remise/valider-remise/valider-remise.component';
import { RemiseValiderComponent } from './valider-remise/valider-remise.component';
import { LoadDataResolver } from '../common/table-data/table-data.resolver';
import { DetailsRemiseComponent } from './details-remise/details-remise.component';
import { LoadDetailsResolver } from '../common/details/details.resolvers';
import { DetailsComponent } from '../common/details/details/details.component';
import { DetailsChequeComponent } from '../remise-aller/remise-aller/details-cheque/details-cheque.component';
import { LoadDataRemiseByReferenceResolver } from './valider-remise/valider-remise.resolver';

const endpoint = "remise/entreprise";
const endpointDetails = "remise/cheques";

export const validerRemiseRoutes: Route[] =
[
    {
        path: '',
        component: RemiseValiderComponent,
        data: { breadcrumb: 'Liste', endpoint: endpoint },
        children: [
            {
                path: '',
                component: ValiderRemiseComponent,
                resolve: {
                    data: LoadDataResolver,
                },
            },
            {
                path: 'details/:id',
                component: DetailsRemiseComponent,
                resolve: {
                    data: LoadDataResolver,
                    remiseData: LoadDataRemiseByReferenceResolver,
                },
                data: { breadcrumb: 'Details remise', endpoint: endpointDetails },
                children: [
                    {
                        path: 'details/:id',
                        component: DetailsChequeComponent,
                        
                        //canDeactivate: [CanDeactivateDetailsSuivi]

                    }
                ]
            }
        ]
    }
]
