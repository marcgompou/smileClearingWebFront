
export class PoidsValidationWorkflow {
  codeWorkflow?:string;
 emailUtilisateur?:string;
  poids:number;
  dateCreation ?:Date;
 dateModification ?:Date;

  


  constructor(){}
  public static constructorPoidsValidationWorkflow(data: any) {
    console.log('--------Workflow data----------',data);
  	const res:PoidsValidationWorkflow={
      codeWorkflow:data?.codeWorkflow,
      emailUtilisateur:data?.emailUtilisateur,
      poids:data?.poids,
      dateCreation:data?.dateCreation,
      dateModification:data?.dateModification
    };
     
    console.log('--------PoidsValidationWorkflow res----------',res);
    
    return res; 
  }
}
