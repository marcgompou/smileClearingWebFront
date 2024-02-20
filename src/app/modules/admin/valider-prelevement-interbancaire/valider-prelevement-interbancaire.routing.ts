import { Route } from '@angular/router';
//import { ValiderRemiseComponent } from './valider-remise/valider-remise/valider-remise.component';
//import { RemiseValiderComponent } from './valider-remise/valider-remise.component';
import { LoadDataResolver, LoadSansPaginationDataResolver } from '../common/table-data/table-data.resolver';
//import { DetailsRemiseComponent } from './details-remise/details-remise.component';
import { LoadDetailsResolver } from '../common/details/details.resolvers';
import { DetailsComponent } from '../common/details/details/details.component';
import { DetailsChequeComponent } from '../remise-aller/remise-aller/details-cheque/details-cheque.component';
import { DetailsPrelevementInterbancaireComponent } from './valider-prelevement-interbancaire/details-prelevement-interbancaire/details-prelevement-interbancaire.component';
import { ValiderPrelevementInterbancaireComponent } from './valider-prelevement-interbancaire/valider-prelevement-interbancaire/valider-prelevement-interbancaire.component';
import { PrelevementValiderInterbancaireComponent } from './valider-prelevement-interbancaire/valider-prelevement-interbancaire.component';
import { LoadPrelevRemiseByIdResolver } from './valider-prelevement-interbancaire/valider-prelevement-interbancaire.resolver';

const endpoint = "prelevement";
const endpointDetails = "prelevement/details";

export const validerPrelevementRoutes: Route[] =
[
    {
        path: '',
        component: PrelevementValiderInterbancaireComponent,
        data: { breadcrumb: 'Liste', endpoint: endpoint },
        children: [
            {
                path: '',
                component: ValiderPrelevementInterbancaireComponent,
                resolve: {
                    data: LoadSansPaginationDataResolver,

                },
            },
            {
                path: 'details/:id',
                component: DetailsPrelevementInterbancaireComponent,
                resolve: {
                    dataDetails: LoadSansPaginationDataResolver, //LoadDataResolver
                    prelevRemise:LoadPrelevRemiseByIdResolver
                },
                data: { breadcrumb: 'Details prélèvement', endpoint: endpointDetails },

            }
        ]
    }
]
