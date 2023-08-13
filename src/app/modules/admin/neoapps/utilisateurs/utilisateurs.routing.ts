import { Route } from '@angular/router';
import { CanDeactivateUtilisateursDetails } from 'app/modules/admin/neoapps/utilisateurs/utilisateurs.guards';
import { UtilisateursComponent } from 'app/modules/admin/neoapps/utilisateurs/utilisateurs/utilisateurs.component';
import { ListComponent } from 'app/modules/admin/neoapps/utilisateurs/utilisateurs/list/list.component';
import { DetailComponent } from 'app/modules/admin/neoapps/utilisateurs/utilisateurs/detail/detail.component';
import { UtilisateursResolver } from './utilisateurs/utilisateurs.resolver';
import { UtilisateursCreateComponent } from './utilisateurs/create/create.component';

export const utilisateursRoutes: Route[] = [
    {
        path     : '',
        component: UtilisateursComponent,
       
        children : [
            {
                path     : '',
                data : {breadcrumb:'Liste'},
                component: ListComponent,
                resolve  : {
                    utilisateurs : UtilisateursResolver
                    
                },
                children : [
                    {
                        path         : ':id',
                        component    : DetailComponent,
                        resolve      : {
                            client  : UtilisateursResolver
                        },
                        canDeactivate: [CanDeactivateUtilisateursDetails]
                    }
                    ,{
                        path         : 'creation/add',
                        data: { breadcrumb: 'Création' },
                        component    : UtilisateursCreateComponent
                    }
                ]
            }
        ]
    }
];
