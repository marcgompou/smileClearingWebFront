import { Route } from '@angular/router';
import { HelpCenterFaqsComponent } from './faqs/faqs.component';
import { HelpCenterGuidesCategoryComponent } from './guides/category/category.component';
import { HelpCenterGuidesGuideComponent } from './guides/guide/guide.component';
import { HelpCenterGuidesComponent } from './guides/guides.component';
import { HelpCenterComponent } from './help-center.component';
import { HelpCenterMostAskedFaqsResolver, HelpCenterFaqsResolver, HelpCenterGuidesResolver, HelpCenterGuidesCategoryResolver, HelpCenterGuidesGuideResolver } from './help-center.resolvers';
import { HelpCenterSupportComponent } from './support/support.component';

export const helpCenterRoutes: Route[] = [
    {
        path     : '',
        component: HelpCenterComponent,
        resolve  : {
            faqs: HelpCenterMostAskedFaqsResolver
        },
        children: [
            {
                path     : 'accueil',
                component: HelpCenterComponent,
                resolve  : {
                    faqs: HelpCenterMostAskedFaqsResolver
                }
            },
        ]
    },
   
    {
        path     : 'faqs',
        component: HelpCenterFaqsComponent,
        resolve  : {
            faqs: HelpCenterFaqsResolver
        }
    },
    {
        path    : 'guides',
        children: [
            {
                path     : '',
                component: HelpCenterGuidesComponent,
                resolve  : {
                    guides: HelpCenterGuidesResolver
                }
            },
            {
                path    : ':categorySlug',
                children: [
                    {
                        path     : '',
                        component: HelpCenterGuidesCategoryComponent,
                        resolve  : {
                            guides: HelpCenterGuidesCategoryResolver
                        }
                    },
                    {
                        path     : ':guideSlug',
                        component: HelpCenterGuidesGuideComponent,
                        resolve  : {
                            guide: HelpCenterGuidesGuideResolver
                        }
                    }
                ]
            }
        ]
    },
    {
        path     : 'support',
        component: HelpCenterSupportComponent
    }
];
