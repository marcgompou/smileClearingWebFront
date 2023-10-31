import { Route } from '@angular/router';
// import { CanDeactivateUtilisateursDetails } from 'app/modules/admin/neoapps/utilisateurs/utilisateurs.guards';
import { ConfirmationUtilisateurComponent } from './confirmation-utilisateur/confirmation-utilisateur.component';
import { ConfirmationUtilisateurResolver } from './confirmation-utilisateur.resolver';

export const ConfirmationRoute: Route[] = [
    {
        path     : '',
        resolve  : {
            data:ConfirmationUtilisateurResolver
        },
        component: ConfirmationUtilisateurComponent,
    }
];
