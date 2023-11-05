import { Route } from '@angular/router';
import { CanDeactivateUtilisateursDetails } from 'app/modules/admin/neoapps/utilisateurs/utilisateurs.guards';
import { LoadDataResolver } from '../common/table-data/table-data.resolver';
import { CreateComponent } from '../common/create/create/create.component';
import { DetailsComponent } from '../common/details/details/details.component';
import { EntrepriseComponent } from './entreprise/entreprise.component';
import { ListComponent } from './entreprise/list/list.component';
import { LoadDetailsResolver } from '../common/details/details.resolvers';

const endpoint = 'entreprises';
export const entrepriseRoutes: Route[] = [
    {
        path     : '',
        component: EntrepriseComponent,
        children : [
            {
                path     : '',
                data : {breadcrumb:'Liste',endpoint:endpoint},
                component: ListComponent,
                resolve  : {
                    entreprise : LoadDataResolver
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
