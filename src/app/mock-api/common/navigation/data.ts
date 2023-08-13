/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id      : 'participants',
        title   : 'Participants',
        subtitle: 'Gestion des participants',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [
            {
                id   : 'participants.eligibles',
                title: 'Etablissements éligibles',
                type : 'basic',
                icon : 'heroicons_outline:library',
                link : '/participants/eligibles'
            },
            {
                id   : 'participants.referentiel',
                title: 'Référentiel des participants',
                type : 'basic',
                icon : 'heroicons_outline:badge-check',
                link : '/participants/actifs'
            },
            {
                id   : 'participants.configurations',
                title: 'Cconfigurations des accès',
                type : 'basic',
                icon : 'heroicons_outline:cog',
                link : '/participants/actifs'
            },
            {
                id      : 'participants.enrolements',
                title   : 'Gestion des enrôlements',
                type    : 'collapsable',
                icon    : 'heroicons_outline:trending-up',
                children: [
                    {
                        id   : 'participants.enrolements.demandes',
                        title: 'Demandes d\'enrôlement',
                        type : 'basic',
                        link : '/participants/enrolements/phases'
                    },
                    {
                        id   : 'participants.enrolements.validations',
                        title: 'Edition des contrats',
                        type : 'basic',
                        link : '/participants/enrolements/validations'
                    },
                    {
                        id   : 'participants.enrolements.rapports',
                        title: 'Rapports des tests',
                        type : 'basic',
                        link : '/participants/enrolements/rapports'
                    }
                ]
            },
        ]
    },
    {
        id      : 'transferts',
        title   : 'Transferts de fonds',
        subtitle: 'Gestion des virements interopérables',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [
            {
                id      : 'transferts.suivi',
                title   : 'Suivi des transferts',
                type    : 'collapsable',
                icon    : 'heroicons_outline:switch-horizontal',
                children: [
                    {
                        id   : 'transferts.suivi.phases',
                        title: 'Transferts en cours',
                        type : 'basic',
                        link : '/transferts/suivi/en-cours'
                    },
                    {
                        id   : 'transferts.suivi.traites',
                        title: 'Transferts traités',
                        type : 'basic',
                        link : '/transferts/suivi/traites'
                    },
                    {
                        id   : 'transferts.suivi.rapports',
                        title: 'Transferts archivés',
                        type : 'basic',
                        link : '/transferts/suivi/archivés'
                    }
                ]
            },
            {
                id      : 'transferts.comptes',
                title   : 'Gestion des comptes',
                type    : 'collapsable',
                icon    : 'heroicons_outline:cash',
                children: [
                    {
                        id   : 'transferts.comptes.suivi',
                        title: 'Suivi des comptes',
                        type : 'basic',
                        link : '/transferts/comptes/suivi'
                    },
                    {
                        id   : 'transferts.comptes.mouvements',
                        title: 'Mouvements des comptes',
                        type : 'basic',
                        link : '/transferts/comptes/mouvements'
                    }
                ]
            },
            {
                id      : 'transferts.compense',
                title   : 'Gestion de la compense',
                type    : 'collapsable',
                icon    : 'heroicons_outline:scale',
                children: [
                    {
                        id   : 'transferts.compense.suivi',
                        title: 'Paramétrage des arrêtés',
                        type : 'basic',
                        link : '/transferts/compense/arretes'
                    },
                    {
                        id   : 'transferts.compense.calculs',
                        title: 'Calculs de le compense',
                        type : 'basic',
                        link : '/transferts/compense/calculs'
                    },
                    {
                        id   : 'transferts.compense.rapports',
                        title: 'Rapports de calculs',
                        type : 'basic',
                        link : '/transferts/compense/rapports'
                    }
                ]
            },
            {
                id      : 'transferts.facturation',
                title   : 'Gestion de la facturation',
                type    : 'collapsable',
                icon    : 'heroicons_outline:calculator',
                children: [
                    {
                        id   : 'transferts.facturation.periodes',
                        title: 'Périodes et fréquences',
                        type : 'basic',
                        link : '/transferts/facturation/periodes'
                    },
                    {
                        id   : 'transferts.facturation.calculs',
                        title: 'Calculs de la facturation',
                        type : 'basic',
                        link : '/transferts/facturation/calculs'
                    },
                    {
                        id   : 'transferts.facturation.factures',
                        title: 'Edition des factures',
                        type : 'basic',
                        link : '/transferts/facturation/factures'
                    }
                ]
            }
        ]
    },
    {
        id      : 'identites',
        title   : 'Identités et alias',
        subtitle: 'Comptes et Alias de comptes',
        type    : 'group',
        icon    : 'heroicons_outline:identification',
        children: [
            {
                id   : 'identites.alias',
                title: 'Réferentiel des alias',
                type : 'basic',
                icon : 'heroicons_outline:clipboard-check',
                link : '/identites/alias'
            },
            {
                id      : 'identites.verifications',
                title   : 'Suivi des vérifications',
                type    : 'collapsable',
                icon    : 'heroicons_outline:identification',
                children: [
                    {
                        id   : 'identites.verifications.encours',
                        title: 'Vérifications en cours',
                        type : 'basic',
                        link : '/identites/verifications/phases'
                    },
                    {
                        id   : 'identites.verifications.validations',
                        title: 'Vérifications traitées',
                        type : 'basic',
                        link : '/identites/verifications/traitees'
                    },
                    {
                        id   : 'identites.verifications.rapports',
                        title: 'Vérifications archivées',
                        type : 'basic',
                        link : '/identites/verifications/archivees'
                    }
                ]
            },
        ]
    },
    {
        id      : 'website',
        title   : 'Gestion du site web',
        subtitle: 'Site web d\'informations',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [
            {
                id   : 'website.faq',
                title: 'Foire aux questions',
                type : 'basic',
                icon : 'heroicons_outline:light-bulb',
                link : '/website/faq'
            },
            {
                id   : 'website.comptes',
                title: 'Gestion des utilisateurs',
                type : 'basic',
                icon : 'heroicons_outline:user-group',
                link : '/website/utilisateurs'
            },
            {
                id   : 'website.statistiques',
                title: 'Statistiques de consultation',
                type : 'basic',
                icon : 'heroicons_outline:chart-square-bar',
                link : '/website/statistiques'
            }
        ]
    },
    {
        id      : 'administration',
        title   : 'Administration',
        subtitle: 'Paramètrage et suivi du fonctionnement',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [
            {
                id   : 'administration.apis',
                title: 'Suivi des APIs',
                type : 'basic',
                icon : 'heroicons_outline:clipboard-check',
                link : '/administration/apis'
            },
            {
                id   : 'administration.queues',
                title: 'Suivi des messages',
                type : 'basic',
                icon : 'heroicons_outline:adjustments',
                link : '/administration/messages'
            },
            {
                id      : 'administration.securite',
                title   : 'Gestion des accès',
                type    : 'collapsable',
                icon    : 'heroicons_outline:lock-closed',
                children: [
                    {
                        id   : 'administration.securite.roles',
                        title: 'Permissions et Rôles',
                        type : 'basic',
                        link : '/administration/securite/roles'
                    },
                    {
                        id   : 'administration.securite.utilisateurs',
                        title: 'Liste des utilisateurs',
                        type : 'basic',
                        link : '/administration/securite/utilisateurs'
                    },
                ]
            },
        ]
    },
];

export const compactNavigation: FuseNavigationItem[] = [];
export const futuristicNavigation: FuseNavigationItem[] = [];
export const horizontalNavigation: FuseNavigationItem[] = [];
