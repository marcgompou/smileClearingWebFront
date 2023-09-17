import { Route } from '@angular/router';
import { LoadDataResolver } from '../common/table-data/table-data.resolver';
import { LoadDetailsResolver } from '../common/details/details.resolvers';
import { DetailsComponent } from '../common/details/details/details.component';
import { DetailsChequeComponent } from '../remise-aller/remise-aller/details-cheque/details-cheque.component';
import { DetailsPrelevementComponent } from './traitement-prelevement/details-prelevement/details-prelevement.component';
import { ListeTraitementPrelevementComponent } from './traitement-prelevement/liste-traitement-prelevement/liste-traitement-prelevement.component';
import { TraitementPrelevementComponent } from './traitement-prelevement/traitement-prelevement.component';

const endpoint = "prelevement/admin";
const endpointDetails = "prelevement/admin";

export const traitementPrelevementRoutes: Route[] =
[
    {
        path: '',
        component: TraitementPrelevementComponent,
        data: { breadcrumb: 'Liste', endpoint: endpoint },
        children: [
            {
                path: '',
                component: ListeTraitementPrelevementComponent,
                resolve: {
                    data: LoadDataResolver,
                },
            },
            {
                path: 'details/:id',
                component: DetailsPrelevementComponent,
                resolve: {
                    data: LoadDataResolver,
                },
                data: { breadcrumb: 'Details remise', endpoint: endpointDetails },
                children: [
                    {
                        path: 'details/:id',
                        component: DetailsChequeComponent,
                       

                    }
                ]
            }
        ]
    }
]
