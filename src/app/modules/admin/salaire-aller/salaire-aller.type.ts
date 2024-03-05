export interface Salaire {
   
    IDEntreprise: string;
    IDRemisePrelev: string;
    Nomfichier: string;
    CodeBanque: string;
    Codeagence: string;
    NumCompte: string;
    numeroLigne: string;
    typeLigne: string;
    Montant: string;
    Statut: string;
    Motif: string;
    NomClient: string;
    DateCreation: Date;
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