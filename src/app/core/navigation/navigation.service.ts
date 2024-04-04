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
          id: "",
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
          title: "Dashboard",
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
    //Virement
    // {
    //   id: "smilecheckweb-viements",
    //   title: "VIREMENTS",
    //   subtitle: "",
    //   type: "group",
    //   icon: "heroicons_outline:document-download",
    //   permission: SecService.permissions.ROLE_CHARG_SALAIRE, //CHARG_SALAIRE
    //   children: [
    //     {
    //       id: "pages",
    //       title: "Virement Sica",
    //       type: "collapsable",
    //       icon: "heroicons_outline:document-download",
    //       permission: SecService.permissions.ROLE_CHARG_SALAIRE, //CHARG_SALAIRE
    //       children: [
    //         {
    //           id: "chargerSalaire",
    //           title: "Enregistrer virement",
    //           type: "basic",
    //           icon: "heroicons_outline:arrow-circle-down",
    //           link: "/chargerSalaire",
    //           permission: SecService.permissions.ROLE_CHARG_SALAIRE , //CHARG_SALAIRE
    //         },
    //         {
    //           id: "chargerSalaire",
    //           title: "Valider virement",
    //           type: "basic",
    //           icon: "heroicons_outline:arrow-circle-down",
    //           link: "/chargerSalaire",
    //           permission: SecService.permissions.ROLE_CHARG_SALAIRE , //CHARG_SALAIRE
    //         },
    //       ],
    //     },
    //     {
    //       id: "pages",
    //       title: "Virement Instantané (PI)",
    //       type: "collapsable",
    //       icon: "heroicons_outline:clipboard-check",
    //       permission: SecService.permissions.ROLE_VALID_SALAIRE, //CHARG_SALAIRE
    //       children: [
    //         {
    //           id: "enregistrerPi",
    //           title: "Enregistrer virement instantané",
    //           type: "basic",
    //           icon: "heroicons_solid:check-circle",
    //           link: "/validerSalaire",
    //           permission: SecService.permissions.ROLE_VALID_SALAIRE,
    //         },
    //         {
    //           id: "validerPi",
    //           title: "Valider virement instantané",
    //           type: "basic",
    //           icon: "heroicons_solid:check-circle",
    //           link: "/validerSalaire",
    //           permission: SecService.permissions.ROLE_VALID_SALAIRE,
    //         },
    //       ],
    //     },
    //   ],
    // },
    //Salaire
    {
      id: "smilecheckweb-salaires",
      title: "TRAITEMENT SALAIRE",
      subtitle: "",
      type: "group",
      icon: "heroicons_outline:document-download",
      children: [
        {
          id: "pages",
          title: "Salaire",
          type: "collapsable",
          icon: "heroicons_outline:document-download",
          permission: SecService.permissions.ROLE_CHARG_SALAIRE, //CHARG_SALAIRE
          children: [
            {
              id: "chargerSalaire",
              title: "Charger salaire",
              type: "basic",
              icon: "heroicons_outline:arrow-circle-down",
              link: "/chargerSalaire",
              permission: SecService.permissions.ROLE_CHARG_SALAIRE , //CHARG_SALAIRE
            },
          ],
        },
        {
          id: "pages",
          title: "Valider Salaire",
          type: "collapsable",
          icon: "heroicons_outline:clipboard-check",
          permission: SecService.permissions.ROLE_VALID_SALAIRE, //CHARG_SALAIRE
          children: [
            {
              id: "validerSalaire",
              title: "Valider salaire",
              type: "basic",
              icon: "heroicons_solid:check-circle",
              link: "/validerSalaire",
              permission: SecService.permissions.ROLE_VALID_SALAIRE,
            },
          ],
        },
      ],
    },


    //PRELEVEMENT

    {
      id: "smilecheckweb-prelevement",
      title: "PRELEVEMENT INTERNE",
      subtitle: "",
      type: "group",
      icon: "heroicons_outline:document-download",
      children: [
        {
          id: "pages",
          title: "Créer Prélèvement interne",
          type: "collapsable",
          icon: "heroicons_outline:document-download",
          permission: SecService.permissions.ROLE_CHARG_PRELEVEMENT,
          children: [
            {
              id: "chargerPrelevement",
              title: "Charger Prélèvement interne",
              type: "basic",
              icon: "heroicons_outline:arrow-circle-down",
              link: "/chargerPrelevement",
              permission: SecService.permissions.ROLE_CHARG_PRELEVEMENT,
            },
            // {
            //   id: "impressionPrelevement",
            //   title: "Impression Prelevement interne",
            //   type: "basic",
            //   icon: "heroicons_solid:printer",
            //   link: "/impressionPrelevement",
            //   permission: SecService.permissions.ROLE_CHARG_PRELEVEMENT,
            // },
          ],
        },

        {
          id: "pages",
          title: "Valider Prélèvement interne",
          type: "collapsable",
          icon: "heroicons_outline:clipboard-check",
          permission: SecService.permissions.ROLE_VALID_PRELEVEMENT,
          children: [
            {
              id: "validerPrelevement",
              title: "Validation Prélèvement interne",
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
      id: "smilecheckweb-prelevement",
      title: "PRELEVEMENT INTERBANCAIRE",
      subtitle: "",
      type: "group",
      icon: "heroicons_outline:document-download",
      children: [
        {
          id: "pages",
          title: "Créer Prélèvement interbancaire",
          type: "collapsable",
          icon: "heroicons_outline:document-download",
          permission: SecService.permissions.ROLE_CHARG_PRELEVEMENT_INTER_BANK,
          children: [
            {
              id: "chargerPrelevementInterBancaire",
              title: "Charger Prélèvement interbancaire",
              type: "basic",
              icon: "heroicons_outline:arrow-circle-down",
              link: "/chargerPrelevementInterBancaire",
              permission: SecService.permissions.ROLE_CHARG_PRELEVEMENT_INTER_BANK,
            },
            // {
            //   id: "impressionPrelevement",
            //   title: "Impression Prelevement interbancaire",
            //   type: "basic",
            //   icon: "heroicons_solid:printer",
            //   link: "/impressionPrelevement",
            //   permission: SecService.permissions.ROLE_CHARG_PRELEVEMENT,
            // },
          ],
        },

        {
          id: "pages",
          title: "Valider Prélèvement interbancaire",
          type: "collapsable",
          icon: "heroicons_outline:clipboard-check",
          permission: SecService.permissions.ROLE_VALID_PRELEVEMENT_INTER_BANK,
          children: [
            {
              id: "validerPrelevementInterbancaire",
              title: "Validation Prélèvement interbancaire",
              type: "basic",
              icon: "heroicons_outline:check-circle",
              link: "/validerPrelevementInterbancaire",
              permission: SecService.permissions.ROLE_VALID_PRELEVEMENT_INTER_BANK,
            },
          ],
        },
      ],
    },

    {
      id: "smilecheckweb-operationBancaire",
      title: "OPERATION BANCAIRE",
      subtitle: "",
      type: "group",
      icon: "heroicons_outline:document-download",
      children: [
        {
          id: "pages",
          title: "Transaction Bancaire",
          type: "collapsable",
          icon: "heroicons_outline:document-download",
          permission: SecService.permissions.ROLE_CHARG_AFB120, //TODO
          children: [
            {
              id: "operationBancaire",
              title: "Transaction Bancaire",
              type: "basic",
              icon: "heroicons_outline:arrow-circle-down",
              link: "/operationBancaire",
              permission: SecService.permissions.ROLE_CHARG_AFB120,
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
              link: "/help-center/accueil",
              
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

           
          ],
        },

        {
          id: "pages",
          title: "Workflows",
          type: "collapsable",
          icon: "heroicons_outline:adjustments",
          permission: SecService.permissions.ROLE_ADMIN,
          children: [
            {
              id: "traitementSalaire",
              title: "Traiter salaire",
              type: "basic",
              icon: "heroicons_outline:arrow-circle-right",
              link: "/traitementSalaire",
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
      permission: SecService.permissions.ROLE_SUPERADMIN,
      children: [
        {
          id: "smilecheckweb-support",
          title: "ADMINISTRATEUR",
          subtitle: "",
          type: "collapsable",
          icon: "heroicons_outline:shield-check",
          permission: SecService.permissions.ROLE_SUPERADMIN,
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
              title: "Parametrage Compte remise",
              type: "basic",
              //icon : 'heroicons_outline:support',
              link: "/parametreCompte",
              permission: SecService.permissions.ROLE_SUPERADMIN,
            },
            {
              id: "parametreCompteAfb120",
              title: "Parametrage Compte AFB120",
              type: "basic",
              //icon : 'heroicons_outline:support',
              link: "/parametreCompteAfb120",
              permission: SecService.permissions.ROLE_SUPERADMIN,
            },
            {
              id: "parametreWorkflow",
              title: "Parametrage Workflow",
              type: "basic",
              //icon : 'heroicons_outline:support',
              link: "/parametreWorkflow",
              permission: SecService.permissions.ROLE_SUPERADMIN,
            },
            {
              id: "parametrePoidsValidationWorkflow",
              title: "Parametrage Poids Validation Workflow",
              type: "basic",
              //icon : 'heroicons_outline:support',
              link: "/parametrePoidsValidationWorkflow",
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
