export class Prelevement {
      public id?: string;
      public nomfichier?: string;
      public iDEntreprise?: string;
      public intitulerCompteBeneficiaire?: string;
      public typeLigne?: string;
      public codebanque?: string;
      public codeagence?: string;
      public numCompte?: string;
      public nbPrelevement?: string;
      public mtTotal?: string;
      public statut?: string;
      public infoPrelev?: string;
      public dateEdition?: string;
      public datePrelevment?: string;
      public dateExportation?: string;
      public dateEngistrement?: string;
      public idExportPrelevement?: string;
      public endos?: string;
      public codeEmetteur?: string;
      public nomfichierGenere?: string



      

  constructor(){}
  public static constructorPrelevement(data: any) {
    console.log('-------- data----------',data);
  	const compte:Prelevement={
    
      id : data?.id,
      statut : data?.statut,
   
    };
    
      return compte;

}

}


