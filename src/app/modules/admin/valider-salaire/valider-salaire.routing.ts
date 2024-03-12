import { Route } from '@angular/router';
//import { ValiderRemiseComponent } from './valider-remise/valider-remise/valider-remise.component';
//import { RemiseValiderComponent } from './valider-remise/valider-remise.component';
import { LoadDataResolver, LoadSansPaginationDataResolver } from '../common/table-data/table-data.resolver';
//import { DetailsRemiseComponent } from './details-remise/details-remise.component';
import { LoadDetailsResolver } from '../common/details/details.resolvers';
import { DetailsComponent } from '../common/details/details/details.component';
import { DetailsChequeComponent } from '../remise-aller/remise-aller/details-cheque/details-cheque.component';
import { DetailsSalaireComponent } from './valider-salaire/details-salaire/details-salaire.component';
import { ValiderSalaireComponent } from './valider-salaire/valider-salaire/valider-salaire.component';
import { SalaireValiderComponent } from './valider-salaire/valider-salaire.component';
import { LoadPrelevRemiseByIdResolver } from './valider-salaire/valider-salaire.resolver';

const endpoint = "salaires";
const endpointDetails = "salaires/details";

export const validerSalaireRoutes: Route[] =
[
    {
        path: '',
        component: SalaireValiderComponent,
        data: { breadcrumb: 'Liste', endpoint: endpoint },
        children: [
            {
                path: '',
                component: ValiderSalaireComponent,
                resolve: {
                    data: LoadSansPaginationDataResolver,

                },
            },
            {
                path: 'details/:id',
                component: DetailsSalaireComponent,
                resolve: {
                    dataDetails: LoadSansPaginationDataResolver, //LoadDataResolver
                    prelevRemise:LoadPrelevRemiseByIdResolver
                },
                data: { breadcrumb: 'Details prélèvement', endpoint: endpointDetails },

            }
        ]
    }
]
