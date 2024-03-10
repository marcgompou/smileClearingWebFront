import { Route } from '@angular/router';
import { CanDeactivateCompteDetails } from 'app/modules/admin/compte/compte.guards';
import { PoidsValidationWorkflowComponent } from 'app/modules/admin/poidsValidationWorkflow/poidsValidationWorkflow/poidsValidationWorkflow.component';
import {  ListPoidsValidationWorkflowComponent } from 'app/modules/admin/poidsValidationWorkflow/poidsValidationWorkflow/list/list.component';
import { CreateComponent } from '../common/create/create/create.component';
import { LoadDataResolver } from '../common/table-data/table-data.resolver';
import { DetailsComponent } from '../common/details/details/details.component';
import { LoadDetailsResolver } from '../common/details/details.resolvers';
import { EntreprisesResolver } from '../entreprise/entreprise/entreprise.resolver';
import {  UtilisateursResolver } from '../neoapps/utilisateurs/utilisateurs/utilisateurs.resolver';

const endpoint = "poidsValidationWorkflows";
export const poidsValidationWorkflowRoutes: Route[] = [
    {
        path: '',
        component: PoidsValidationWorkflowComponent,
        children: [
            {
                path: '',

                component: ListPoidsValidationWorkflowComponent,
                resolve: {
                    data: LoadDataResolver,
                    utilisateur : UtilisateursResolver,
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
                        component    : PoidsValidationWorkflowComponent,
                    }
                ]
            }
        ]
    }
];

