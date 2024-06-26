import { Route } from '@angular/router';
//import { ValiderRemiseComponent } from './valider-remise/valider-remise/valider-remise.component';
//import { RemiseValiderComponent } from './valider-remise/valider-remise.component';
import { LoadDataResolver, LoadSansPaginationDataResolver } from '../common/table-data/table-data.resolver';
//import { DetailsRemiseComponent } from './details-remise/details-remise.component';
import { LoadDetailsResolver } from '../common/details/details.resolvers';
import { DetailsComponent } from '../common/details/details/details.component';
import { DetailsChequeComponent } from '../remise-aller/remise-aller/details-cheque/details-cheque.component';
import { DetailsPrelevementComponent } from './valider-prelevement/details-prelevement/details-prelevement.component';
import { ValiderPrelevementComponent } from './valider-prelevement/valider-prelevement/valider-prelevement.component';
import { PrelevementValiderComponent } from './valider-prelevement/valider-prelevement.component';
import { LoadPrelevRemiseByIdResolver } from './valider-prelevement/valider-prelevement.resolver';

const endpoint = "prelevement";
const endpointDetails = "prelevement/details";

export const validerPrelevementRoutes: Route[] =
[
    {
        path: '',
        component: PrelevementValiderComponent,
        data: { breadcrumb: 'Liste', endpoint: endpoint },
        children: [
            {
                path: '',
                component: ValiderPrelevementComponent,
                resolve: {
                    data: LoadDataResolver//LoadSansPaginationDataResolver,

                },
            },
            {
                path: 'details/:id',
                component: DetailsPrelevementComponent,
                resolve: {
                    dataDetails: LoadSansPaginationDataResolver, //LoadDataResolver
                    prelevRemise:LoadPrelevRemiseByIdResolver
                },
                data: { breadcrumb: 'Details prélèvement', endpoint: endpointDetails },

            }
        ]
    }
]
