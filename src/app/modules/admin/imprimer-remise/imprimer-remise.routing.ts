import { Route } from '@angular/router';
import { ImprimerRemiseComponent } from './imprimer-remise/imprimer-remise/imprimer-remise.component';
import { RemiseImprimerComponent } from './imprimer-remise/imprimer-remise.component';
import { LoadDataResolver } from '../common/table-data/table-data.resolver';
import { DetailsImprimerComponent } from './details-importation/details-imprimer.component';

const endpoint = "exportation";
const endpointDetailsRemise = "remise/export";
const endpointDetails = "exportation";

    
export const imprimerRemiseRoutes: Route[] =
[
    {
        path: '',
        component: RemiseImprimerComponent,
        data: { breadcrumb: 'Liste', endpoint: endpoint },
        children: [
            {
                path: '',
                component: ImprimerRemiseComponent,
                resolve: {
                    data: LoadDataResolver,
                },
            },
            {
                path: 'details/:id',
                component: DetailsImprimerComponent,
                resolve: {
                    data: LoadDataResolver,
                },
                data: { breadcrumb: 'Details remise', endpoint: endpointDetails },
                children: [
                    {
                        path: 'details/:id',
                        component: DetailsImprimerComponent,
                        //canDeactivate: [CanDeactivateDetailsSuivi]
                    }
                ]
            }
        ]
    }
]
