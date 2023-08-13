import { Route } from '@angular/router';
import { CanDeactivateClientsDetails } from 'app/modules/admin/neoapps/clients/clients.guards';
import { ClientsComponent } from 'app/modules/admin/neoapps/clients/clients/clients.component';
import { ListComponent } from 'app/modules/admin/neoapps/clients/clients/list/list.component';
import { DetailComponent } from 'app/modules/admin/neoapps/clients/clients/detail/detail.component';
import { ClientsResolver } from './clients/clients.resolver';
import { ClientsCreateComponent } from './clients/create/create.component';

export const clientsRoutes: Route[] = [
    {
        path     : '',
        component: ClientsComponent,
       
        children : [
            {
                path     : '',
                data : {breadcrumb:'Liste'},
                component: ListComponent,
                resolve  : {
                    clients : ClientsResolver
                    
                },
                children : [
                    {
                        path         : ':id',
                        component    : DetailComponent,
                        resolve      : {
                            client  : ClientsResolver
                        },
                        canDeactivate: [CanDeactivateClientsDetails]
                    }
                    ,{
                        path         : 'creation/add',
                        data: { breadcrumb: 'Création' },
                        component    : ClientsCreateComponent
                    }
                ]
            }
        ]
    }
];
