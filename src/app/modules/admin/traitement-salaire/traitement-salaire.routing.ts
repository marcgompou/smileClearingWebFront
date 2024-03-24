import { Route } from '@angular/router';
import { LoadDataResolver, LoadSansPaginationDataResolver } from '../common/table-data/table-data.resolver';
import { DetailsComponent } from '../common/details/details/details.component';
import { DetailsSalaireComponent } from './traitement-salaire/details-salaire/details-salaire.component';
import { ListeTraitementSalaireComponent } from './traitement-salaire/liste-traitement-salaire/liste-traitement-salaire.component';
import { TraitementSalaireComponent } from './traitement-salaire/traitement-salaire.component';
import { LoadPrelevATraiterByIdResolver } from './traitement-salaire/traitement-salaire.resolver';

const endpoint = "salaire/admin";
const endpointDetails = "salaire/admin";

export const traitementSalaireRoutes: Route[] =
[
    {
        path: '',
        component: TraitementSalaireComponent,
        data: { breadcrumb: 'Liste', endpoint: endpoint },
        children: [
            {
                path: '',
                component: ListeTraitementSalaireComponent,
                resolve: {
                    data: LoadDataResolver,
                },
            },
            {
                path: 'details/:id',
                component: DetailsSalaireComponent,
                resolve: {
                    data: LoadSansPaginationDataResolver,
                    salaire:LoadPrelevATraiterByIdResolver
                },
                data: { breadcrumb: 'Détails salaire ', endpoint: endpointDetails },
                children: [
                    {
                        path: 'details/:id',
                        component: DetailsComponent,
                        data:{ breadcrumb: 'Details paiement', endpoint: endpointDetails },
                    }
                ]
            }
        ]
    }
]
