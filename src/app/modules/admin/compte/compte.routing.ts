import { Route } from '@angular/router';
import { CanDeactivateCompteDetails } from 'app/modules/admin/compte/compte.guards';
import { CompteComponent } from 'app/modules/admin/compte/compte/compte.component';
import { ListComponent } from 'app/modules/admin/compte/compte/list/list.component';
import { CreateComponent } from '../common/create/create/create.component';
import { LoadDataResolver } from '../common/table-data/table-data.resolver';
import { DetailsComponent } from '../common/details/details/details.component';
import { LoadDetailsResolver } from '../common/details/details.resolvers';

const endpoint = "compteClient";
export const compteRoutes: Route[] = [
    {
        path: '',
        component: CompteComponent,
        children: [
            {
                path: '',

                component: ListComponent,
                resolve: {
                    data: LoadDataResolver,
                },
                data: { breadcrumb: 'Liste', endpoint: endpoint },

                children: [

                    {
                        path: 'create',
                        data: { breadcrumb: 'Création' },
                        component: CreateComponent
                    },

                    {
                        path: 'details/:id',
                        component: DetailsComponent,
                        //canDeactivate: [CanDeactivateDetailsSuivi]
                        resolve: {
                            data: LoadDetailsResolver,
                        },
                        data: { breadcrumb: 'Détails', endpoint: endpoint },

                    }


                ]
            }
        ]
    }
];

