export interface Cheque {
    imageVerso: string;
    imageRecto: string;
    numChq:string;
    montant:number;
    codeBanque:string;
    codeAgence:string;
    cleRib:string;
    compte:string;
    cleRibIsCorrect:boolean;
    numChequeIsCorrect:boolean;
    compteIsCorrect:boolean;
    codeBanqueIsCorrect:boolean;
    codeAgenceIsCorrect:boolean;
    chequeIsCorrect:boolean; //chequeContainsError
    tire?:string;
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
  