import { Route } from '@angular/router';
import { LoadDataResolver, LoadSansPaginationDataResolver } from '../common/table-data/table-data.resolver';
import { LoadDetailsResolver } from '../common/details/details.resolvers';
import { DetailsComponent } from '../common/details/details/details.component';
import { DetailsChequeComponent } from '../remise-aller/remise-aller/details-cheque/details-cheque.component';
import { DetailsSalaireComponent } from './traitement-salaire/details-salaire/details-salaire.component';
import { TraitementSalaireComponent } from './traitement-salaire/traitement-salaire/traitement-salaire.component';
import { SalaireTraitementComponent } from './traitement-salaire/traitement-salaire.component';
import { LoadSalaireByIdResolver, LoadSuiviSalaireResolver } from './traitement-salaire/traitement-salaire.resolver';

const endpoint = "salaires";
const endpointDetails = "salaires/details";

export const traitementSalaireRoutes: Route[] =
[
    {
        path: '',
        component: SalaireTraitementComponent,
        data: { breadcrumb: 'Liste', endpoint: endpoint },
        children: [
            {
                path: '',
                component: TraitementSalaireComponent,
                resolve: {
                    data: LoadSansPaginationDataResolver,

                },
            },
            {
                path: 'details/:id',
                component: DetailsSalaireComponent,
                resolve: {
                    dataDetails: LoadSansPaginationDataResolver, //LoadDataResolver
                    loadSalaireById:LoadSalaireByIdResolver,
                    loadSuiviSalaire:LoadSuiviSalaireResolver
                },
                data: { breadcrumb: 'Details salaire', endpoint: endpointDetails },

            }
        ]
    }
]
