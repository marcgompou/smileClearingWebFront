


export class Agence
{
  codeAgence?:string;
    libelle?:string;
    public static constructorAgence(data:any) {
      console.log("=====data====>",data); 
      let response ={
        codeAgence : data?.codeAgence,
        libelle: data?.libelle,
      }
      console.log("=====response====>",response);
      return response;
    }
}




