export interface Salaire {
   
 
    nomFichier: string;
    codeEnreg: string;
    codeOperation: string;
    extension: string;
    idEntreprise: string;
    nomEntrepriseFichier: string;
    nombreVirement:string;
    nomEntreprise: string;
    numLigne: string;
    codeEmeteur: string;
    codccd: string;
    dateEcheance: Date;
    niveauValidation:string;
    nomCompte: string;
    refer: string;
    indrel: string;
    guichet: string;
    compte: string;
    idenf: string;
    banque: string;
    zoneVide: string

}
export class CompteEntreprises {
    id?: number;
    banque: string;
    agence: string;
    compte: string;
    cleRib: string;
    designation: string;
    statut?: string;
    agenceRemettant?: string;
    identreprise: number;}