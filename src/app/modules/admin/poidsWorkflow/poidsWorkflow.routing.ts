import { Route } from '@angular/router';
import { CanDeactivateCompteDetails } from 'app/modules/admin/compte/compte.guards';
import { CompteAfbComponent } from 'app/modules/admin/compteAfb120/compteAfb/compteAfb.component';
import { ListAfbComponent } from 'app/modules/admin/compteAfb120/compteAfb/list/list.component';
import { CreateComponent } from '../common/create/create/create.component';
import { LoadDataResolver } from '../common/table-data/table-data.resolver';
import { DetailsComponent } from '../common/details/details/details.component';
import { LoadDetailsResolver } from '../common/details/details.resolvers';
import { EntreprisesResolver } from '../entreprise/entreprise/entreprise.resolver';
import { AgencesResolver } from '../agence/agence/agence.resolver';

const endpoint = "compteAfb120";
export const compteAfbRoutes: Route[] = [
    {
        path: '',
        component: CompteAfbComponent,
        children: [
            {
                path: '',

                component: ListAfbComponent,
                resolve: {
                    data: LoadDataResolver,
                    entreprise  : EntreprisesResolver,
                    agence : AgencesResolver
                   
                },
                data: { breadcrumb: 'Liste', endpoint: endpoint },

                children: [

                    {
                        path: 'create',
                        data: { breadcrumb: 'Création' },
                        component: CreateComponent,
                    },

                    {
                        path: 'details/:id',
                        component: DetailsComponent,
                        //canDeactivate: [CanDeactivateDetailsSuivi]
                        resolve: {
                            data: LoadDetailsResolver,
                        },
                        data: { breadcrumb: 'Détails', endpoint: endpoint },

                    },
                    {
                        path         : 'creation',
                        data: { breadcrumb: 'Création' },
                        resolve:{
                            data:EntreprisesResolver,
                            
                        },
                        component    : CompteAfbComponent,
                    }


                ]
            }
        ]
    }
];

