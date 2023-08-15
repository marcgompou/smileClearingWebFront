import { Route } from '@angular/router';
import { ValiderRemiseComponent } from './valider-remise/valider-remise/valider-remise.component';
import { RemiseValiderComponent } from './valider-remise/valider-remise.component';
import { LoadDataResolver } from '../common/table-data/table-data.resolver';
import { DetailsRemiseComponent } from './details-remise/details-remise.component';

const endpoint = "remise/entreprise";

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
                },
                data: { breadcrumb: 'Details remise', endpoint: endpoint },
            }
        ]
    }
]
