


export class Client
{
    id?:number;
    codeBanque?:number;
    agence?: string;
    numCompte?: string
    titulaire?: string

    public static constructorClient(data:any) {

      console.log("=====data====>",data); 
      
      let response ={
        id : data?.id,
        codeBanque: data?.codeBanque,
        agence: data?.agence,
        numCompte: data?.numCompte ,
        titulaire: data?.titulaire ?? "",
      }
  
      console.log("=====response====>",response);
      return response;
    }
}




