import { Route } from '@angular/router';
import { ValiderRemiseComponent } from './valider-remise/valider-remise/valider-remise.component';
import { DetailsRemiseComponent } from './valider-remise/details-remise/details-remise.component';
import { RemiseValiderComponent } from './valider-remise/valider-remise.component';
import { LoadDataResolver } from '../common/table-data/table-data.resolver';

const endpoint="remise/entreprise";

export const remiseRoutes: Route[] = 
[
    {
        path: '',
        component: RemiseValiderComponent,
        children: [
        {
                path: '',
                component: ValiderRemiseComponent,
                resolve: {
                    data: LoadDataResolver,
                },
                data: { breadcrumb: 'Remise à valider', endpoint: endpoint },
                
                children: [
                    {
                        path: 'remise/entreprise',
                        component: DetailsRemiseComponent
                    }
                ]
            }
        ]
    }
]
//LoadDataCompteEntrepriseResolver
