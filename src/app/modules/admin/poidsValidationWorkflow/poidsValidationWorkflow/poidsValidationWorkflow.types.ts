
export class PoidsValidationWorkflow {
  codeWorkflow?:string;
  idUtilisateur:number;
 emailUtilisateur:string;
  poids:number;
 statut:number;
  dateCreation ?:Date;
 dateModification ?:Date;

  


  constructor(){}
  public static constructorPoidsValidationWorkflow(data: any) {
    console.log('--------Workflow data----------',data);
  	const res:PoidsValidationWorkflow={
      codeWorkflow:data.codeWorkflow,
      idUtilisateur:data.idUtilisateur,
      emailUtilisateur:data.emailUtilisateur,
      poids:data.poids,
      statut:data.statut,
      dateCreation:data.dateCreation,
      dateModification:data.dateModification
    };
     
    console.log('--------PoidsValidationWorkflow res----------',res);
    
    return res; 
  }
}
