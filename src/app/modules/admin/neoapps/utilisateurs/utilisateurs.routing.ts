import { Route } from '@angular/router';
import { CanDeactivateUtilisateursDetails } from 'app/modules/admin/neoapps/utilisateurs/utilisateurs.guards';
import { UtilisateursComponent } from 'app/modules/admin/neoapps/utilisateurs/utilisateurs/utilisateurs.component';
import { ListComponent } from 'app/modules/admin/neoapps/utilisateurs/utilisateurs/list/list.component';
import { EntreprisesResolver, RolesResolver, UtilisateursByIdResolver, UtilisateursResolver } from './utilisateurs/utilisateurs.resolver';
import { UtilisateursCreateComponent } from './utilisateurs/create/create.component';
import { LoadDataResolver } from '../../common/table-data/table-data.resolver';
import { DetailsComponent } from '../../common/details/details/details.component';
import { LoadDetailsResolver } from '../../common/details/details.resolvers';
const endpoint="users";
export const utilisateursRoutes: Route[] = [
    {
        path     : '',
        component: UtilisateursComponent,
        children : [
            {
                path     : '',
                data : {breadcrumb:'Liste', endpoint: endpoint},
                component: ListComponent,
                resolve  : {
                    utilisateurs : LoadDataResolver,
                    entreprise  : EntreprisesResolver
                },
                children : [
                    {
                        path         : 'details/:id',
                        data : { endpoint: endpoint  },
                        component    : DetailsComponent,
                        resolve      : {
                            data  : UtilisateursByIdResolver,
                            detail: LoadDetailsResolver
                        },
                        canDeactivate: [CanDeactivateUtilisateursDetails]
                    },
                    {
                        path         : 'creation/add',
                        data: { breadcrumb: 'Création' },
                        resolve:{
                            data:EntreprisesResolver
                        },
                        component    : UtilisateursCreateComponent,
                    }
                ]
            }
        ]
    }
];
