
export class Utilisateurs {
  id?: string;
  email: string;
  password: string;
  nom: string;
  prenom: string;
  numeroTel: string;
  fonction: string;
  identreprise: number;
  operateur?: string;
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
      prenom : data?.prenom,
      numeroTel : data?.numeroTel,
      fonction : data?.fonction,
      identreprise : data?.identreprise??0,
      isConfirme : data?.isConfirme,
      typeMfa : data?.typeMfa,
      operateur:data?.operateur || "----",
      token : data?.token,
      statut : data?.statut,
      roles : data?.roles || data?.userRoles || [],
      statutMfa : data?.statutMfa,
    }

    console.log("=====response====>",response);
    return response;
  }
}
