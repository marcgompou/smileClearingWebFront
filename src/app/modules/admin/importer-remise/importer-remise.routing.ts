import { Route } from '@angular/router';
import { ImporterRemiseComponent } from './importer-remise/importer-remise/importer-remise.component';
import { RemiseImporterComponent } from './importer-remise/importer-remise.component';
import { LoadDataResolver } from '../common/table-data/table-data.resolver';
//import { DetailsRemiseComponent } from './details-remise/details-remise.component';
import { LoadDetailsResolver } from '../common/details/details.resolvers';
import { DetailsComponent } from '../common/details/details/details.component';
//import { DetailsChequeComponent } from '../remise-aller/remise-aller/details-cheque/details-cheque.component';
import { DetailsImportationComponent } from './details-importation/details-importation.component';
import { DetailsRemiseComponent } from '../valider-remise/details-remise/details-remise.component';
import { DetailsChequeComponent } from '../remise-aller/remise-aller/details-cheque/details-cheque.component';

const endpoint = "exportation";
const endpointDetails = "exportation";
const endpointDetailsRemise = "remise/export";


export const importerRemiseRoutes: Route[] =
[
    {
        path: '',
        component: RemiseImporterComponent,
        data: { breadcrumb: 'Liste', endpoint: endpoint },
        children: [
            {
                path: '',
                component: ImporterRemiseComponent,
                resolve: {
                    data: LoadDataResolver,
                },
            },
             {
                 path: 'details/:id',
                 component: DetailsImportationComponent,
                 resolve: {
                     data: LoadDataResolver,
                },
                 data: { breadcrumb: 'Details Remise importer', endpoint: endpointDetails },
                children: [
                    
                    
                    {
                        path: 'details/:id',
                        component: DetailsRemiseComponent,
                        resolve: {
                            data: LoadDataResolver,
                        },
                        data: { breadcrumb: 'Details remise', endpoint: endpointDetailsRemise },
                        children: [
                            {
                                path: 'details/:id',
                                component: DetailsChequeComponent,
                                //canDeactivate: [CanDeactivateDetailsSuivi]
        
                            }
                        ]
                    }


                ]
            },
            

           
        ]
    }
]
