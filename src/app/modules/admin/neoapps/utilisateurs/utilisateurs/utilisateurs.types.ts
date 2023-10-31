
export class Utilisateurs {
  id?: string;
  email: string;
  password: string;
  nom: string;
  Prenom: string;
  numeroTel: string;
  fonction: string;
  identreprise: number;
  isConfirme: boolean;
  typeMfa: boolean;
  token: string;
  statut: true;
  roles: string[];
  statutMfa: boolean;

  public constructor() {}
  public static constructorUtilisateur(data:any) {

    console.log("=====data====>",data); 
    
    let response ={
      id : data?.id,
      email : data?.email,
      password : data?.password,
      nom : data?.nom,
      Prenom : data?.Prenom,
      numeroTel : data?.numeroTel,
      fonction : data?.fonction,
      identreprise : data?.identreprise,
      isConfirme : data?.isConfirme,
      typeMfa : data?.typeMfa,
      token : data?.token,
      statut : data?.statut,
      roles : data?.roles || data?.UserRoles || [],
      statutMfa : data?.statutMfa,
    }

    console.log("=====response====>",response);
    return response;
  }
}
