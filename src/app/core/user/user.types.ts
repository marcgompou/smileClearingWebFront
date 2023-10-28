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
    idEntreprise?:string;
    changePassword:boolean;
    
    constructor(data?){

        this.id=data?.id;
        this.prenom=data?.prenom;
        this.name=data?.nom;
        this.nom=data.nom;
        this.fonction=data?.fonction;
        this.roles=data?.roles || [];
        this.changePassword=data?.changePassword;
        this.idEntreprise=data?.idEntreprise;
    }
}