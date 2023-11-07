import { Route } from '@angular/router';
import { CanDeactivateUtilisateursDetails } from 'app/modules/admin/neoapps/utilisateurs/utilisateurs.guards';
import { LoadDataResolver } from '../common/table-data/table-data.resolver';
import { CreateComponent } from '../common/create/create/create.component';
import { DetailsComponent } from '../common/details/details/details.component';
import { AgenceComponent } from './agence/agence.component';
import { ListComponent } from './agence/list/list.component';
import { LoadDetailsResolver } from '../common/details/details.resolvers';

const endpoint = 'agences';
export const agenceRoutes: Route[] = [
    {
        path     : '',
        component: AgenceComponent,
        children : [
            {
                path     : '',
                data : {breadcrumb:'Liste',endpoint:endpoint},
                component: ListComponent,
                resolve  : {
                    agence : LoadDataResolver
                },
                children : [
                    {
                        path         : 'details/:id',
                        component    : DetailsComponent,
                        resolve      : {
                            agence  : LoadDetailsResolver
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
