import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, ReplaySubject } from "rxjs";
import { Navigation } from "app/core/navigation/navigation.types";
import { FuseNavigationItem } from "@fuse/components/navigation";
import { SecService } from "../sec/sec.service";
import { UserService } from "../user/user.service";
import { User } from "../user/user.types";
import { cloneDeep } from "lodash";

@Injectable({
  providedIn: "root",
})
export class NavigationService {
  noRolesNavigation: FuseNavigationItem[] = [
    {
      id: "NoRoleNavigation",
      title: "Général",
      type: "group",
      icon: "heroicons_outline:chart-pie",
      children: [
        {
          id: "401",
          title: "Autorisations requises",
          type: "basic",
          icon: "heroicons_outline:library",
          link: "/error/401",
        },
      ],
    },
  ];

  defaultNavigation: FuseNavigationItem[] = [
    {
      id: "home",
      title: "Accueil",
      subtitle: "",
      type: "group",
      icon: "heroicons_outline:home",
      children: [
        {
          id: "dashboard",
          title: "Accueil",
          type: "basic",
          link: "/home",
          icon: "heroicons_outline:home",
        },
      ],
    },

    {
      id: "smilecheck",
      title: "DASHBOARD",
      subtitle: "",
      type: "group",
      icon: "heroicons_outline:chart-pie",
      children: [
        {
          id: "dashboard",
          title: "dashboard",
          type: "basic",
          link: "/dashboard",
          icon: "heroicons_outline:chart-pie",
          permission: SecService.permissions.ROLE_VISUALISATION,
        },
      ],
    },

    {
      id: "smilecheck",
      title: "REMISE ALLER",
      subtitle: "",
      type: "group",
      icon: "heroicons_outline:home",
      children: [
        {
          id: "creationremise",
          title: "Créer Remise",
          type: "collapsable",
          icon: "heroicons_outline:pencil-alt",
          permission: SecService.permissions.ROLE_CREATION,
          children: [
            {
              id: "creerRemiseCheque",
              title: "Création remise chèque",
              type: "basic",
              icon: "heroicons_outline:pencil",
              link: "/remise",
              permission: SecService.permissions.ROLE_CREATION,
            },
          ],
        },

        {
          id: "pages",
          title: "Valider Remise",
          type: "collapsable",
          icon: "heroicons_outline:clipboard-check",
          permission: SecService.permissions.ROLE_VALIDATION,
          children: [
            {
              id: "validerRemise",
              title: "Validation/Exportation",
              type: "basic",
              icon: "heroicons_outline:check-circle",
              link: "/validerRemise",
              permission: SecService.permissions.ROLE_VALIDATION,
            },
            {
              id: "imprimerRemise",
              title: "Impression Remises Exportées",
              type: "basic",
              icon: "heroicons_solid:printer",
              link: "/imprimerRemise",
              permission: SecService.permissions.ROLE_VALIDATION,
            },
          ],
        },
      ],
    },

    //PRELEVEMENT

    {
      id: "smilecheckweb-prelevement",
      title: "PRELEVEMENT ALLER",
      subtitle: "",
      type: "group",
      icon: "heroicons_outline:document-download",
      children: [
        {
          id: "pages",
          title: "Créer Prélèvement",
          type: "collapsable",
          icon: "heroicons_outline:document-download",
          permission: SecService.permissions.ROLE_CHARG_PRELEVEMENT,
          children: [
            {
              id: "chargerPrelevement",
              title: "Charger Prélèvement",
              type: "basic",
              icon: "heroicons_outline:arrow-circle-down",
              link: "/chargerPrelevement",
              permission: SecService.permissions.ROLE_CHARG_PRELEVEMENT,
            },
            {
              id: "impressionPrelevement",
              title: "Impression Prelevement",
              type: "basic",
              icon: "heroicons_solid:printer",
              link: "/impressionPrelevement",
              permission: SecService.permissions.ROLE_CHARG_PRELEVEMENT,
            },
          ],
        },

        {
          id: "pages",
          title: "Valider Prélèvement",
          type: "collapsable",
          icon: "heroicons_outline:clipboard-check",
          permission: SecService.permissions.ROLE_VALID_PRELEVEMENT,
          children: [
            {
              id: "validerPrelevement",
              title: "Validation Prélèvement",
              type: "basic",
              icon: "heroicons_outline:check-circle",
              link: "/validerPrelevement",
              permission: SecService.permissions.ROLE_VALID_PRELEVEMENT,
            },
          ],
        },
      ],
    },

    {
      id: "support",
      title: "CENTRE DE SUPPORT",
      subtitle: "",
      type: "group",
      icon: "heroicons_outline:help",

      
      children: [
        {
          id: "smilecheckweb-support",
          title: "CENTRE DE SUPPORT",
          subtitle: "",
          type: "collapsable",
          icon: "heroicons_outline:support",
          
          children: [
            {
              id: "centre-aide",
              title: "Accueil Support",
              type: "basic",
              icon: "heroicons_outline:support",
              link: "/help-center",
              
            },

            {
              id: "centre-aidefaqs",
              title: "FAQs",
              type: "basic",
              icon: "heroicons_outline:information-circle",
              link: "/help-center/faqs",
             
            },
            
            {
              id: "centre-aideguides",
              title: "Guide",
              type: "basic",
              icon: "heroicons_outline:book-open",
              link: "/help-center/guides",
              
            },
            {
              id: "centre-aidesupport",
              title: "Ouvrir un Ticket",
              type: "basic",
              icon: "heroicons_outline:chat-alt-2",
              link: "/help-center/support",
            },
          ],
        },
      ],
    },

    {
      id: "smilecheckweb-administration",
      title: "ADMINISTRATION",
      subtitle: "",
      type: "group",
      icon: "heroicons_outline:home",
      children: [
        {
          id: "pages",
          title: "Importer Remise",
          type: "collapsable",
          icon: "heroicons_outline:cloud-upload",
          permission: SecService.permissions.ROLE_ADMIN,
          children: [
            {
              id: "importerRemise",
              title: "Importation Remise GR",
              type: "basic",
              icon: "heroicons_outline:arrow-circle-up",
              link: "/importerRemise",
              permission: SecService.permissions.ROLE_ADMIN,
            },
            // {
            //     id: 'imprimerRemiseImporter',
            //     title: 'Impression Remise Importer',
            //     type: 'basic',
            //     icon: 'heroicons_solid:printer',
            //     link: '/imprimerRemiseImporter',
            //     permission: SecService.permissions.ROLE_ADMIN
            // },
            // {
            //     id: 'impressionCheque',
            //     title: 'Impression Chèque',
            //     type: 'basic',
            //     icon: 'heroicons_solid:printer',
            //     link: '/impressionCheque',
            //     permission: SecService.permissions.ROLE_ADMIN
            // },
          ],
        },
        {
          id: "pages",
          title: "Manager Prélèvement",
          type: "collapsable",
          icon: "heroicons_outline:adjustments",
          permission: SecService.permissions.ROLE_ADMIN,
          children: [
            {
              id: "traitementPrelevement",
              title: "Traitement Prélèvement",
              type: "basic",
              icon: "heroicons_outline:arrow-circle-right",
              link: "/traitementPrelevement",
              permission: SecService.permissions.ROLE_ADMIN,
            },

            {
              id: "retourPrelevement",
              title: "Retour prélèvement",
              type: "basic",
              icon: "heroicons_outline:arrow-circle-left",
              link: "/traitementRetourPrelevement",
              permission: SecService.permissions.ROLE_ADMIN,
            },

            {
              id: "relancePrelevement",
              title: "Relance prélèvement",
              type: "basic",
              icon: "heroicons_outline:switch-horizontal",
              link: "/relancePrelevement",
              permission: SecService.permissions.ROLE_ADMIN,
            },
          ],
        },
      ],
    },

    {
      id: "smilecheckweb-parametre",
      title: "PARAMETRAGE",
      subtitle: "",
      type: "group",
      icon: "heroicons_outline:home",
      children: [
        // {
        //   id: "smilecheckweb-support",
        //   title: "ENTREPRISE",
        //   subtitle: "",
        //   type: "collapsable",
        //   icon: "heroicons_outline:support",
        //   children: [
        //     {
        //       id: "help-center",
        //       title: "Parametrages Endos",
        //       type: "basic",
        //       //    icon : 'heroicons_outline:support',
        //       link: "/help-center",
        //       permission: SecService.permissions.ROLE_SUPERADMIN,
        //     },

        //     {
        //       id: "help-centerfaqs",
        //       title: "Reinitialisation de mot de passe",
        //       type: "basic",
        //       //icon : 'heroicons_outline:support',
        //       link: "/help-center/faqs",
        //       permission: SecService.permissions.ROLE_SUPERADMIN,
        //     },
        //   ],
        // },

        {
          id: "smilecheckweb-support",
          title: "ADMINISTRATEUR",
          subtitle: "",
          type: "collapsable",
          icon: "heroicons_outline:shield-check",
          children: [
            {
              id: "parametreClient",
              title: "Parametrages Clients",
              type: "basic",
              //    icon : 'heroicons_outline:support',
              link: "/parametreClient",
              permission: SecService.permissions.ROLE_SUPERADMIN,
            },

            {
              id: "parametreUtilisateur",
              title: "Parametrages Utilisateurs",
              type: "basic",
              //icon : 'heroicons_outline:support',
              link: "/parametreUser",
              permission: SecService.permissions.ROLE_SUPERADMIN,
            },

            {
              id: "parametreCompte",
              title: "Parametrage Compte Bancaire",
              type: "basic",
              //icon : 'heroicons_outline:support',
              link: "/parametreCompte",
              permission: SecService.permissions.ROLE_SUPERADMIN,
            },

            {
              id: "parametreAgence",
              title: "Parametrage Agence Bancaire",
              type: "basic",
              //icon : 'heroicons_outline:support',
              link: "/parametreAgence",
              permission: SecService.permissions.ROLE_SUPERADMIN,
            },

            {
              id: "parametreEntreprise",
              title: "Parametrages Entreprise",
              type: "basic",
              //icon : 'heroicons_outline:building-office-2',
              link: "/parametreEntreprise",
              permission: SecService.permissions.ROLE_SUPERADMIN,
            },
          ],
        },
      ],
    },
  ];
  user: User;

  private _navigation: ReplaySubject<Navigation> =
    new ReplaySubject<Navigation>(1);

  /**
   * Constructor
   */
  constructor(
    private _httpClient: HttpClient,
    private _userService: UserService
  ) {
    this._userService.user$.subscribe((user: User) => {
      this.user = user;
      if (user) {
        this.get(); //recuperer les menus sur lesquels le user peut naviguer
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
      console.log("user", this.user);
      let items: FuseNavigationItem[] = [];

      if (!this.user.roles) {
        items = this.noRolesNavigation;
      } else {
        this._getAuthorizedItems(
          this.defaultNavigation,
          this.user.roles,
          items
        );
      }

      // construct navigation Menu
      const navigation = {
        default: items && items.length > 0 ? items : this.noRolesNavigation,
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
  private _getAuthorizedItems(
    navigation: FuseNavigationItem[],
    roles: string[],
    authorizedNavigation: FuseNavigationItem[]
  ) {
    for (const item of navigation) {

      if (
        item.id == "home") {
        authorizedNavigation.push(item);
        continue;
      }

      if (
        item.id == "support") {
        authorizedNavigation.push(item);
        continue;
      }
      if ( 
        item.id == "centre-aide") {
        authorizedNavigation.push(item);
        continue;
      }
      if (
        item.id == "smilecheckweb-support") {
        authorizedNavigation.push(item);
        continue;
      }
      if (
        item.id == "centre-aidefaqs") {
        authorizedNavigation.push(item);
        continue;
      }

      if (
        item.id == "centre-aideguides") {
        authorizedNavigation.push(item);
        continue;
      }
      if (
        item.id == "centre-aidesupport") {
        authorizedNavigation.push(item);
        continue;
      }
      if (
        
        (item.type === "basic" &&
          item.permission &&
          roles.includes(item.permission))
      ) {
        authorizedNavigation.push(item);
        continue;
      }

      if (
        (item.type === "aside" ||
          item.type === "collapsable" ||
          item.type === "group") &&
        item.children
      ) {
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
