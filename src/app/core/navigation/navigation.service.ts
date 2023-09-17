import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { Navigation } from 'app/core/navigation/navigation.types';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { SecService } from '../sec/sec.service';
import { UserService } from '../user/user.service';
import { User } from '../user/user.types';
import { cloneDeep } from 'lodash';

@Injectable({
    providedIn: 'root'
})
export class NavigationService {
    noRolesNavigation: FuseNavigationItem[] = [
        {
            id: 'NoRoleNavigation',
            title: 'Général',
            type: 'group',
            icon: 'heroicons_outline:home',
            children: [
                {
                    id: '401',
                    title: 'Autorisations requises',
                    type: 'basic',
                    icon: 'heroicons_outline:library',
                    link: '/error/401'
                }
            ]
        }
    ];

    defaultNavigation: FuseNavigationItem[] = [
        //BLOCK REMISE


        {
            id: 'smilecheck',
            title: 'DASHBOARD',
            subtitle: '',
            type: 'group',
            icon: 'heroicons_outline:home',
            children: [

                {
                    id: 'dashboard',
                    title: 'dashboard',
                    type: 'basic',
                    link: '/home',
                    icon: 'heroicons_outline:home',
                    permission: SecService.permissions.ROLE_SCAN,

                },

            ]




        },
        {
            id: 'smilecheck',
            title: 'REMISE ALLER',
            subtitle: '',
            type: 'group',
            icon: 'heroicons_outline:home',
            children: [

                {
                    id: 'creationremise',
                    title: 'Création Remise',
                    type: 'collapsable',
                    icon: 'heroicons_outline:document',
                    permission: SecService.permissions.ROLE_SCAN,
                    children:
                        [
                            {

                                id: 'creerRemiseCheque',
                                title: 'Creer remise chèque',
                                type: 'basic',
                                icon: 'heroicons_outline:template',
                                link: '/remise',
                                permission: SecService.permissions.ROLE_SCAN
                            },
                            {
                                id: 'creerRemiseEffet',
                                title: 'Creer remise effet',
                                type: 'basic',
                                icon: 'heroicons_outline:template',
                                link: '/remiseeffet',
                                permission: SecService.permissions.ROLE_SCAN
                            },

                        ]
                },


                {
                    id: 'pages',
                    title: 'Valider Remise',
                    type: 'collapsable',
                    icon: 'heroicons_outline:document',
                    permission: SecService.permissions.ROLE_SCAN,
                    children:
                        [
                            {
                                id: 'validerRemise',
                                title: 'Validation Remise',
                                type: 'basic',
                                icon: 'heroicons_outline:template',
                                link: '/validerRemise',
                                permission: SecService.permissions.ROLE_SCAN
                            },
                            {
                                id: 'imprimerRemise',
                                title: 'Impression Remise',
                                type: 'basic',
                                icon: 'heroicons_solid:printer',
                                link: '/imprimerRemise',
                                permission: SecService.permissions.ROLE_SCAN
                            },
                        ]
                },


                


            ]




        },


        //PRELEVEMENT

        {
            id: 'smilecheckweb-prelevement',
            title: 'PRELEVEMENT ALLER',
            subtitle: '',
            type: 'group',
            icon: 'heroicons_outline:home',
            children: [
                {
                    id: 'pages',
                    title: 'Prélèvement',
                    type: 'collapsable',
                    icon: 'heroicons_outline:document',
                    permission: SecService.permissions.ROLE_SCAN,
                    children:
                        [

                            {
                                id: 'chargerPrelevement',
                                title: 'Charger Prélèvement',
                                type: 'basic',
                                icon: 'heroicons_outline:template',
                                link: '/chargerPrelevement',
                                permission: SecService.permissions.ROLE_SCAN
                            },
                            {
                                id: 'impressionPrelevement',
                                title: 'Impression Prelevement',
                                type: 'basic',
                                icon: 'heroicons_solid:printer',
                                link: '/impressionPrelevement',
                                permission: SecService.permissions.ROLE_SCAN
                            },

                        ]
                },

                {
                    id: 'pages',
                    title: 'Valider Prélèvement',
                    type: 'collapsable',
                    icon: 'heroicons_outline:document',
                    permission: SecService.permissions.ROLE_SCAN,
                    children:
                        [

                            {
                                id: 'validerPrelevement',
                                title: 'Valider Prélèvement',
                                type: 'basic',
                                icon: 'heroicons_outline:template',
                                link: '/validerPrelevement',
                                permission: SecService.permissions.ROLE_SCAN
                            },
                            {
                                id: 'impressionPrelevementvalider',
                                title: 'Impression Prelevement valider',
                                type: 'basic',
                                icon: 'heroicons_solid:printer',
                                link: '/impressionRemiseExporter',
                                permission: SecService.permissions.ROLE_SCAN
                            },

                        ]
                },


                


            ]


        },


        {
            id: 'smilecheckweb-prelevement',
            title: 'CENTRE DE SUPPORT',
            subtitle: '',
            type: 'group',
            icon: 'heroicons_outline:home',
            children: [




                {
                    id: 'smilecheckweb-support',
                    title: 'CENTRE DE SUPPORT',
                    subtitle: '',
                    type: 'collapsable',
                    icon: 'heroicons_outline:support',
                    children: [

                        {
                            id: 'help-center',
                            title: 'Accueil',
                            type: 'basic',
                            //    icon : 'heroicons_outline:support',
                            link: '/help-center',
                            permission: SecService.permissions.ROLE_SCAN
                        },

                        {
                            id: 'help-centerfaqs',
                            title: 'FAQs',
                            type: 'basic',
                            //icon : 'heroicons_outline:support',
                            link: '/help-center/faqs',
                            permission: SecService.permissions.ROLE_SCAN
                        },

                        {
                            id: 'help-centerguides',
                            title: 'Guide',
                            type: 'basic',
                            // icon : 'heroicons_outline:support',
                            link: '/help-center/guides',
                            permission: SecService.permissions.ROLE_SCAN
                        },
                        {
                            id: 'help-centersupport',
                            title: 'Ouvrir un Ticket',
                            type: 'basic',
                            //icon : 'heroicons_outline:clipboard-check',
                            link: '/help-center/support',
                            permission: SecService.permissions.ROLE_SCAN
                        },





                    ]


                },
            ]
        },

        {
            id: 'smilecheckweb-prelevement',
            title: 'ADMINISTRATION',
            subtitle: '',
            type: 'group',
            icon: 'heroicons_outline:home',
            children: [
               
                {
                    id: 'pages',
                    title: 'Importer Remise',
                    type: 'collapsable',
                    icon: 'heroicons_outline:document',
                    permission: SecService.permissions.ROLE_EXPORT,
                    children:
                        [

                            {
                                id: 'importerRemise',
                                title: 'Importation Remise GR',
                                type: 'basic',
                                icon: 'heroicons_outline:template',
                                link: '/importerRemise',
                                permission: SecService.permissions.ROLE_EXPORT
                            },
                            {
                                id: 'imprimerRemiseImporter',
                                title: 'Impression Remise Importer',
                                type: 'basic',
                                icon: 'heroicons_solid:printer',
                                link: '/imprimerRemiseImporter',
                                permission: SecService.permissions.ROLE_EXPORT
                            },
                            {
                                id: 'impressionCheque',
                                title: 'Impression Chèque',
                                type: 'basic',
                                icon: 'heroicons_solid:printer',
                                link: '/impressionCheque',
                                permission: SecService.permissions.ROLE_EXPORT
                            },
                        ]
                },
                {
                    id: 'pages',
                    title: 'Manager Prélèvement',
                    type: 'collapsable',
                    icon: 'heroicons_outline:document',
                    permission: SecService.permissions.ROLE_SCAN,
                    children:
                        [

                            {
                                id: 'traitementPrelevement',
                                title: 'Traitement Prélèvement',
                                type: 'basic',
                                icon: 'heroicons_outline:template',
                                link: '/traitementPrelevement',
                                permission: SecService.permissions.ROLE_SCAN
                            },

                            {
                                id: 'chargerprelevement',
                                title: 'Cloturer Prélèvement',
                                type: 'basic',
                                icon: 'heroicons_outline:template',
                                link: '/remiseExporter',
                                permission: SecService.permissions.ROLE_SCAN
                            },

                            {
                                id: 'impressionPrelevementvalider',
                                title: 'Impression Prelevement exporter',
                                type: 'basic',
                                icon: 'heroicons_solid:printer',
                                link: '/impressionRemiseExporter',
                                permission: SecService.permissions.ROLE_SCAN
                            },

                            {
                                id: 'retourPrelevement',
                                title: 'Retour prélèvement',
                                type: 'basic',
                                icon: 'heroicons_outline:clipboard-check',
                                link: '/impressionRemiseExporter',
                                permission: SecService.permissions.ROLE_SCAN
                            },

                            {
                                id: 'rattrappagePrelevement',
                                title: 'Rattrappage prélèvement',
                                type: 'basic',
                                icon: 'heroicons_outline:clipboard-check',
                                link: '/impressionRemiseExporter',
                                permission: SecService.permissions.ROLE_SCAN
                            },

                            {
                                id: 'relancePrelevement',
                                title: 'Relance prélèvement',
                                type: 'basic',
                                icon: 'heroicons_outline:clipboard-check',
                                link: '/impressionRemiseExporter',
                                permission: SecService.permissions.ROLE_SCAN
                            },

                        ]
                },


            ]


        },



        {
            id: 'smilecheckweb-parametre',
            title: 'PARAMETRAGE',
            subtitle: '',
            type: 'group',
            icon: 'heroicons_outline:home',
            children: [
                {
                    id: 'smilecheckweb-support',
                    title: 'ENTREPRISE',
                    subtitle: '',
                    type: 'collapsable',
                    icon: 'heroicons_outline:support',
                    children: [

                        {
                            id: 'help-center',
                            title: 'Parametrages Endos',
                            type: 'basic',
                            //    icon : 'heroicons_outline:support',
                            link: '/help-center',
                            permission: SecService.permissions.ROLE_SCAN
                        },

                        {
                            id: 'help-centerfaqs',
                            title: 'Reinitialisation de mot de passe',
                            type: 'basic',
                            //icon : 'heroicons_outline:support',
                            link: '/help-center/faqs',
                            permission: SecService.permissions.ROLE_SCAN
                        },


                    ]


                },

                {
                    id: 'smilecheckweb-support',
                    title: 'ADMINISTRATEUR',
                    subtitle: '',
                    type: 'collapsable',
                    icon: 'heroicons_outline:support',
                    children: [

                        {
                            id: 'help-parametre',
                            title: 'Parametrages Clients',
                            type: 'basic',
                            //    icon : 'heroicons_outline:support',
                            link: '/parametre',
                            permission: SecService.permissions.ROLE_SCAN
                        },

                        {
                            id: 'parametreUtilisateur',
                            title: 'Parametrages Utilisateurs',
                            type: 'basic',
                            //icon : 'heroicons_outline:support',
                            link: '/parametreUser',
                            permission: SecService.permissions.ROLE_SCAN
                        },

                        {
                            id: 'parametreCompte',
                            title: 'Parametrage Compte Bancaire',
                            type: 'basic',
                            //icon : 'heroicons_outline:support',
                            link: '/parametreCompte',
                            permission: SecService.permissions.ROLE_SCAN
                        },

                        {
                            id: 'parametreAgence',
                            title: 'Parametrage Agence Bancaire',
                            type: 'basic',
                            //icon : 'heroicons_outline:support',
                            link: '/parametreAgence',
                            permission: SecService.permissions.ROLE_SCAN
                        },


                    ]


                },
            ]
        },
      
    ];
    user: User;

    private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient, private _userService: UserService) {
        this._userService.user$
            .subscribe((user: User) => {
                this.user = user;
                if (user) {
                    this.get()//recuperer les menus sur lesquels le user peut naviguer
                }
            });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for navigation
     */
    get navigation$(): Observable<Navigation> {
        return this._navigation.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all navigation data
     */
    get(): Observable<Navigation> {
        return new Observable((observer) => {
            // filter for user
            console.log('user', this.user);
            let items: FuseNavigationItem[] = [];

            if (!this.user.roles) {
                items = this.noRolesNavigation
            }
            else {
                this._getAuthorizedItems(this.defaultNavigation, this.user.roles, items);
            }

            // construct navigation Menu
            const navigation = {
                default: items && items.length > 0 ? items : this.noRolesNavigation
            } as Navigation;
            console.log(navigation);

            observer.next(navigation);
            observer.complete();
            this._navigation.next(navigation);
        });
    }
    /**
     * Recupérer les menus sur les quels l'utilisateur peut naviguer selon ses rôles
     * @param navigation 
     * @param roles 
     * @param authorizedNavigation 
     */
    private _getAuthorizedItems(navigation: FuseNavigationItem[], roles: string[], authorizedNavigation: FuseNavigationItem[]) {
        for (const item of navigation) {
            if (item.id == "home" || (item.type === 'basic' && item.permission && roles.includes(item.permission))) {
                authorizedNavigation.push(item);
                continue;
            }

            if ((item.type === 'aside' || item.type === 'collapsable' || item.type === 'group') && item.children) {
                const newChildren: FuseNavigationItem[] = [];
                this._getAuthorizedItems(item.children, roles, newChildren);
                if (newChildren.length > 0) {
                    const newItem = cloneDeep(item);
                    newItem.children = newChildren;
                    authorizedNavigation.push(newItem);
                }
            }
        }
    }

}