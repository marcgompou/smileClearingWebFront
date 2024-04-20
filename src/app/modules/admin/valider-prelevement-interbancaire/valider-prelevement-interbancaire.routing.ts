import { Route } from "@angular/router";
import {
  LoadDataResolver,
  LoadSansPaginationDataResolver,
} from "../common/table-data/table-data.resolver";
import { DetailsPrelevementInterbancaireComponent } from "./valider-prelevement-interbancaire/details-prelevement-interbancaire/details-prelevement-interbancaire.component";
import { ValiderPrelevementInterbancaireComponent } from "./valider-prelevement-interbancaire/valider-prelevement-interbancaire/valider-prelevement-interbancaire.component";
import { PrelevementValiderInterbancaireComponent } from "./valider-prelevement-interbancaire/valider-prelevement-interbancaire.component";
import { LoadPrelevRemiseByIdResolver } from "./valider-prelevement-interbancaire/valider-prelevement-interbancaire.resolver";

const endpoint = "prelevement";
const endpointDetails = "prelevement/details";

export const validerPrelevementRoutes: Route[] = [
  {
    path: "",
    component: PrelevementValiderInterbancaireComponent,
    data: { breadcrumb: "Liste", endpoint: endpoint },
    children: [
      {
        path: "",
        component: ValiderPrelevementInterbancaireComponent,
        resolve: {
          data: LoadSansPaginationDataResolver,
        },
      },
      {
        path: "details/:id",
        component: DetailsPrelevementInterbancaireComponent,
        resolve: {
          dataDetails: LoadSansPaginationDataResolver, //LoadDataResolver
          prelevRemise: LoadPrelevRemiseByIdResolver,
        },
        data: { breadcrumb: "Details prélèvement", endpoint: endpointDetails },
      },
    ],
  },
];
