export interface Remise {

    id: string,
    reference: string,
    dateCreation: string,
    agenceRem: string,
    agenceBenef: string,
    numCompte: string,
    nbCheques: number,
    mtTotal: number,
    statut: number,
    identreprise: number
 
}


export class Entreprises {
    identreprise: string;
    statut: string;
    nomEntreprise: string;
    dateCreation: string;
    descriptionActivite: string;}


    export class SuperExportateur {
        identreprise: string;
        nbrExportation : string;
        montantTotal: string;
       }