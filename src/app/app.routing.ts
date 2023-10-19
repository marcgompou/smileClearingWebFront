import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';
import { NoAuthGuard } from './core/auth/guards/noAuth.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/example'
    {path: '', pathMatch : 'full', redirectTo: 'home'},

    // Redirect signed in user to the '/example'
    //
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that ,path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'home'},


    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule)},
            {path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.module').then(m => m.AuthUnlockSessionModule)},
        ]
    },

    //POUR AFFICHER LA PAGE DE CONNEXION
    {
        path: '',
        canActivate: [NoAuthGuard],
        //canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule)},
            {path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule)},
            {path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule)},
            {path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule)},
        
        ]
    },


    // Admin routes
    {
        path       : '',
        canActivate: [AuthGuard],
        //canActivateChild: [AuthGuard],
        component  : LayoutComponent,
        resolve    : {
            initialData: InitialDataResolver,
        },
        children   : [
            {
                path: 'home',
                data: { breadcrumb: 'Accueil' },
                loadChildren: () => import('app/modules/admin/home/home.module').then(m => m.HomeModule)
            },
            {
                path: 'remise',
                data: { breadcrumb: 'Remise aller' },
                loadChildren: () => import('app/modules/admin/remise-aller/remise-aller.module').then(m => m.RemiseAllerModule)
            },




            {
                path: 'validerRemise',
                data: { breadcrumb: 'Remise valider' },
                loadChildren: () => import('app/modules/admin/valider-remise/valider-remise.module').then(m => m.RemiseValiderModule)
            },

            {
                path: 'imprimerRemise',
                data: { breadcrumb: 'Imprimer Remise' },
                loadChildren: () => import('app/modules/admin/imprimer-remise/imprimer-remise.module').then(m => m.RemiseImprimerModule)
            },
            {
                path: 'importerRemise',
                data: { breadcrumb: 'Importer Remise' },
                loadChildren: () => import('app/modules/admin/importer-remise/importer-remise.module').then(m => m.RemiseImporterModule)
            },
            {
                path: 'chargerPrelevement',
                data: { breadcrumb: 'Charger prélèvement' },
                loadChildren: () => import('app/modules/admin/prelevement-aller/prelevement-aller.module').then(m => m.PrelevementAllerModule)
            },

            {
                path: 'validerPrelevement',
                data: { breadcrumb: 'Valider prélèvement' },
                loadChildren: () => import('app/modules/admin/valider-prelevement/valider-prelevement.module').then(m => m.PrelevementValiderModule)
            },
            {
                path: 'traitementPrelevement',
                data: { breadcrumb: 'Traitement prélèvement' },
                loadChildren: () => import('app/modules/admin/traitement-prelevement/traitement-prelevement.module').then(m => m.TraitementPrelevementModule)
            },
            
            {
                path: 'traitementRetourPrelevement',
                data: { breadcrumb: 'Retour prélèvement' },
                loadChildren: () => import('app/modules/admin/prelevement-retour/prelevement-retour.module').then(m => m.PrelevementRetourModule)
            },


            {
                path: 'help-center',
                data: { breadcrumb: 'Support' },
                loadChildren: () => import('app/modules/admin/help-center/help-center.module').then(m => m.HelpCenterModule)
            },
            {
                path: 'help-centerfaqs',
                data: { breadcrumb: 'Faqs' },
                loadChildren: () => import('app/modules/admin/help-center/help-center.module').then(m => m.HelpCenterModule)
            },
            {
                path: 'help-centerguides',
                data: { breadcrumb: 'Guides Utilisateurs' },
                loadChildren: () => import('app/modules/admin/help-center/help-center.module').then(m => m.HelpCenterModule)
            },

            {
                path: 'help-centersupport',
                data: { breadcrumb: 'Ouvrir un ticket' },
                loadChildren: () => import('app/modules/admin/help-center/help-center.module').then(m => m.HelpCenterModule)
            },
            {
                path: 'parametreUser',
                data: { breadcrumb: 'Parametrage de compte utilisateur' },
                loadChildren: () => import('app/modules/admin/neoapps/utilisateurs/utilisateurs.module').then(m => m.UtilisateursModule)
            },
            {
                path: 'parametreCompte',
                data: { breadcrumb: 'Parametrage de compte bancaire' },
                loadChildren: () => import('app/modules/admin/compte/compte/compte.module').then(m => m.CompteModule)
            },
            {
                path: 'parametreAgence',
                data: { breadcrumb: 'Parametrage de agence bancaire' },
                loadChildren: () => import('app/modules/admin/agence/agence/agence.module').then(m => m.AgenceModule)
            },
            {
                path: 'template',
                data: { breadcrumb: 'SMILECHECK-WEBAPP' },
                children: [
                    
                ]
            },
             // Error
            {
                path: 'error', 
                data: { breadcrumb: 'Erreur' },
                children: [
                    {
                        path: '401', 
                        data: { breadcrumb: 'Introuvable' },
                        loadChildren: () => import('app/modules/admin/pages/error/error-403/error-403.module').then(m => m.Error403Module)
                    },
                    {
                        path: '404', 
                        data: { breadcrumb: 'Introuvable' },
                        loadChildren: () => import('app/modules/admin/pages/error/error-404/error-404.module').then(m => m.Error404Module)
                    },
                    {
                        path: '500', 
                        data: { breadcrumb: 'Interne au serveur' },
                        loadChildren: () => import('app/modules/admin/pages/error/error-500/error-500.module').then(m => m.Error500Module)
                    }
                ]
            },
        ]
    }
];
