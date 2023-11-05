import { Route } from '@angular/router';
import { CanDeactivateAgenceDetails } from 'app/modules/admin/agence/agence/agence.guards';
import { AgenceComponent } from 'app/modules/admin/agence/agence/agence/agence.component';
import { ListComponent } from 'app/modules/admin/agence/agence/agence/list/list.component';
import { DetailComponent } from 'app/modules/admin/agence/agence/agence/detail/detail.component';
import { AgenceResolver } from './agence/agence.resolver';
import { AgenceCreateComponent } from './agence/create/create.component';
import { LoadDataResolver } from '../../common/table-data/table-data.resolver';

export const agenceRoutes: Route[] = [
    {
        path     : '',
        component: AgenceComponent,
       
        children : [
            {
                path     : '',
                data : {breadcrumb:'Liste',endpoint:'agence'},
                component: ListComponent,
                resolve  : {
                    agence : LoadDataResolver
                },
                children : [
                    {
                        path         : ':id',
                        component    : DetailComponent,
                        resolve      : {
                            client  : AgenceResolver
                        },
                        canDeactivate: [CanDeactivateAgenceDetails]
                    }
                    ,{
                        path         : 'creation/add',
                        data: { breadcrumb: 'Création' },
                        component    : AgenceCreateComponent
                    }
                ]
            }
        ]
    }
];
