import { Route } from "@angular/router";
import { SalaireAllerComponent } from "./salaire-aller/salaire-aller.component";
import { LoadDataCompteEntrepriseResolver } from "./salaire-aller.resolver";

export const salaireAllerRouting: Route[] = [
  {
    path: "",
    component: SalaireAllerComponent,
    data: { onSameUrlNavigation: "reload" },
    children: [
      {
        path: "",
        component: SalaireAllerComponent,
        resolve: {
          data: LoadDataCompteEntrepriseResolver,
        },
        data: { onSameUrlNavigation: "reload" },
      },
    ],
  },
];
