import { Route } from '@angular/router';
import { HomeComponent } from './home.component';
import { EntreprisesForStatResolver, HomeResolver } from './home.resolvers';

export const DashBoardRoutes: Route[] = [
    {
        path     : '',
        component: HomeComponent,
        resolve  : {
            data: HomeResolver,
            entreprise:EntreprisesForStatResolver
        }
    }
];


