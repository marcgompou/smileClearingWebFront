import { Route } from '@angular/router';
import { LoadDataResolver, LoadSansPaginationDataResolver } from '../common/table-data/table-data.resolver';
import { DetailsTraitementSalaireComponent } from './traitement-salaire/details-traitement-salaire/details-traitement-salaire.component';
import { ListTraitementSalaireComponent } from './traitement-salaire/list-traitement-salaire/list-traitement-salaire.component';
import { TraitementSalaireComponent } from './traitement-salaire/traitement-salaire.component';

const endpoint = "salaires";
const endpointDetails = "salaires/details";

export const traitementSalaireRoutes: Route[] =
[
    {
        path: '',
        component:TraitementSalaireComponent ,
        data: { breadcrumb: 'Liste', endpoint: endpoint },
        children: [
            {
                path: '',
                component: ListTraitementSalaireComponent,
                resolve: {
                    //data: LoadSansPaginationDataResolver,
                    data: LoadDataResolver,
                   // compteEntreprise:CompteEntreprisesAfb120Resolver
                },
            },
            {
                path: 'details/:id',
                component: DetailsTraitementSalaireComponent,
                resolve: {
                    dataDetails: LoadSansPaginationDataResolver, //LoadDataResolver
                    //prelevRemise:LoadPrelevRemiseByIdResolver
                    //TransacBancaire:LoadTransactionBancaireByIdResolver
                },
                data: { breadcrumb: 'Details transaction', endpoint: endpointDetails },

            }
        ]
    }
]
