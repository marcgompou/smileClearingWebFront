import { Route } from '@angular/router';
import { CanDeactivateUtilisateursDetails } from 'app/modules/admin/neoapps/utilisateurs/utilisateurs.guards';
import { LoadDataResolver } from '../common/table-data/table-data.resolver';
import { CreateComponent } from '../common/create/create/create.component';
import { DetailsComponent } from '../common/details/details/details.component';
import { ClientComponent } from './client/client.component';
import { ListComponent } from './client/list/list.component';
import { LoadDetailsResolver } from '../common/details/details.resolvers';

const endpoint = 'clients';
export const entrepriseRoutes: Route[] = [
    {
        path     : '',
        component: ClientComponent,
        children : [
            {
                path     : '',
                data : {breadcrumb:'Liste',endpoint:endpoint},
                component: ListComponent,
                resolve  : {
                    client : LoadDataResolver
                },
                children : [
                    {
                        path         : 'details/:id',
                        component    : DetailsComponent,
                        resolve      : {
                            client  : LoadDetailsResolver
                        },
                        data : {breadcrumb:'Détails',endpoint:endpoint},
                        canDeactivate: [CanDeactivateUtilisateursDetails]
                    },
                    {
                        path         : 'creation',
                        data: { breadcrumb: 'Création' },
                        component    : CreateComponent
                    }
                ]
            }
        ]
    }
];
