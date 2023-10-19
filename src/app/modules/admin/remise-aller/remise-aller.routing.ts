import { Route } from '@angular/router';
import { CreerRemiseComponent } from './remise-aller/creer-remise/creer-remise.component';
import { DetailsChequeComponent } from './remise-aller/details-cheque/details-cheque.component';
import { RemiseAllerComponent } from './remise-aller/remise-aller.component';
import { LoadDataCompteEntrepriseResolver } from './remise-aller/remise-aller.resolver';


export const remiseRoutes: Route[] = [
  {
    path: '',
    component: RemiseAllerComponent,
    children: [
      {
        path: '',
        component: CreerRemiseComponent,
        resolve: {
          data: LoadDataCompteEntrepriseResolver,
        },
        data: { onSameUrlNavigation: 'reload' }, // Ajout de la stratégie "reload"
        children: [
          {
            path: 'details/:id',
            component: DetailsChequeComponent,
            data: { onSameUrlNavigation: 'reload' }, // Ajout de la stratégie "reload"
          },
        ],
      },
    ],
  },
];
