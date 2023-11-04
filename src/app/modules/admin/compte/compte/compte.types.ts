
export class Compte {
  id?: number;
  banque: string;
  agence: string;
  compte: string;
  cleRib: string;
  designation: string;
  statut?: string;
  agenceRemettant: string;
  identreprise: number;

  


  constructor(){}
  public static constructorCompte(compteData: any) {
    console.log('--------compte data----------',compteData);
  	const compte:Compte={
    
    id : compteData?.id,
    banque : compteData.banque,
    agence : compteData.agence,
    compte : compteData.compte,
    cleRib : compteData.cleRib,
    designation : compteData.designation,
    statut : compteData.statut,
    agenceRemettant : compteData.agenceRemettant,
    identreprise : compteData.identreprise,
    };
    
    return compte;
     
    
    
    
    
  }
}
