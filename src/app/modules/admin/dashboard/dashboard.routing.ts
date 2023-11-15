import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EntreprisesForStatResolver, DashboardResolver } from './dashboard/dashboard.resolvers';

export const DashBoardRoutes: Route[] = [
    {
        path     : '',
        component: DashboardComponent,
        resolve  : {
            data: DashboardResolver,
            entreprise:EntreprisesForStatResolver
        }
    }
];


