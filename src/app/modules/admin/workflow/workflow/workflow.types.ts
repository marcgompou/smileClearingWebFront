
export class Workflow {
  id?:string;
  dateCreation:string
  idEntreprise: number;
  codeWorkflow:string;
  niveauValidation:number;

  


  constructor(){}
  public static constructorWorkflow(data: any) {
    console.log('--------Workflow data----------',data);
  	const res:Workflow={
      id:data?.id,
      dateCreation:data?.dateCreation,
      codeWorkflow:data?.codeWorkflow,
      niveauValidation:data?.niveauValidation,
      idEntreprise : data?.idEntreprise,
    };
    
    return res; 
  }
}
