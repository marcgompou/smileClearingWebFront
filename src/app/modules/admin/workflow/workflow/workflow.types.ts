
export class Workflow {
  id?: number;
  banque: string;
  agence: string;
  compte: string;
  cleRib: string;
  designation: string;
  statut?: string;
  identreprise: number;

  


  constructor(){}
  public static constructorCompte(compteData: any) {
    console.log('--------compte data----------',compteData);
  	const compte:Workflow={
    
    id : compteData?.id,
    banque : compteData.banque,
    agence : compteData.agence,
    compte : compteData.compte,
    cleRib : compteData.cleRib,
    designation : compteData.designation,
    statut : compteData.statut,
    identreprise : compteData.identreprise,
    };
    
    return compte; 
  }
}
