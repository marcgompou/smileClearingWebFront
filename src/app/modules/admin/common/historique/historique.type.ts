export class Historique {
    id?:string;
    dateModification?:string
    emailUtilisateur:string
    commentaire?:string;
    etat?:string;
    niveau?:number;
    listeValideurs?:string[];
    traite?:boolean = true ;
}