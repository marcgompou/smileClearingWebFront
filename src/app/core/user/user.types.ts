export class User
{
    id: string;
    nom:string;
    name:string;
    prenom:string;
    fonction:string;
    email: string;
    roles: string[];
    status?:string;
    avatar?:string;
    changePassword:boolean;
    
    constructor(data?){

        this.id=data?.id;
        this.prenom=data?.prenom;
        this.name=data?.nom;
        this.nom=data.nom;
        this.fonction=data?.fonction;
        this.roles=data?.roles || [];
        this.changePassword=data?.changePassword;
    }
}


// export interface User
// {

//     id: number;
//     email: string;
//     nom: string;
//     name: string;
//     avatar?: string;
//     prenom: string;
//     numeroTel: string;
//     fonction: string;
//     identreprise: number;
//     isConfirme: boolean;
//     typeMfa: boolean;
//     statut: true;
//     roles: string[];
//     statutMfa:boolean
      
// }
