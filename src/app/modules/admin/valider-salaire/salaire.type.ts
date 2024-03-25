export interface Salaire {
    
      nomFichier : string,
      nomEntreprise: string,
      codeOperation: string,
      dateEcheance: string,
      codeAgence: string,
      numeroCompte: string,
      libelleTransaction: string,
      nombreVirement: string,
      montantTotal: string,
}


export interface Category
{
    id?: string;
    title?: string;
    slug?: string;
}

export interface Course
{
    id?: string;
    title?: string;
    slug?: string;
    description?: string;
    category?: string;
    duration?: number;
    steps?: {
        order?: number;
        title?: string;
        subtitle?: string;
        content?: string;
    }[];
    totalSteps?: number;
    updatedAt?: number;
    featured?: boolean;
    progress?: {
        currentStep?: number;
        completed?: number;
    };
}

  