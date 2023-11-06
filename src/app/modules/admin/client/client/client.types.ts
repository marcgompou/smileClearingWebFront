


export class Entreprise
{
    identreprise?:number;
    statut?:number;
    nomEntreprise?: string;
    descriptionActivite?: string

    public static constructorEntreprise(data:any) {

      console.log("=====data====>",data); 
      
      let response ={
        identreprise : data?.identreprise,
        nomEntreprise: data?.nomEntreprise,
        descriptionActivite: data?.descriptionActivite,
        statut: data?.statut ?? 1 //Valeur par defaut à la creation
      }
  
      console.log("=====response====>",response);
      return response;
    }
}




