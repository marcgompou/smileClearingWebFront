import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouteReuseStrategy, RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { FuseModule } from '@fuse';
import { FuseConfigModule } from '@fuse/services/config';
import { FuseMockApiModule } from '@fuse/lib/mock-api';
import { CoreModule } from 'app/core/core.module';
import { appConfig } from 'app/core/config/app.config';
import { mockApiServices } from 'app/mock-api';
import { LayoutModule } from 'app/layout/layout.module';
import { AppComponent } from 'app/app.component';
import { appRoutes } from 'app/app.routing';
import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';
import { FuseAlertModule } from '@fuse/components/alert';
import { CustomRouteReuseStrategy } from './custom-route-reuse-strategy'; // Importez votre stratégie personnalisée


const routerConfig: ExtraOptions = {
  //  preloadingStrategy       : PreloadAllModules,
    scrollPositionRestoration: 'enabled'
};




registerLocaleData(localeFr, 'fr');

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes),

        // Fuse, FuseConfig & FuseMockAPI
        FuseModule,
        FuseConfigModule.forRoot(appConfig),
        FuseMockApiModule.forRoot(mockApiServices),

        // Core module of your application
        CoreModule,

        // Layout module of your application
        LayoutModule,
        FuseAlertModule,

        // 3rd party modules that require global configuration via forRoot
        MarkdownModule.forRoot({})
    ],
    bootstrap   : [
        AppComponent
    ],

    providers: [{ provide: LOCALE_ID, useValue: 'fr' } ,  { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy }, // Utilisez votre stratégie personnalisée
],
})
export class AppModule
{
}
