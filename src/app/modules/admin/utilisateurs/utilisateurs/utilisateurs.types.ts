
export interface Utilisateurs 
{
    "id": number,
    "email": string,
    "password": string ,
    "nom": string,
    "Prenom": string,
    "numeroTel": string,
    "fonction": string,
    "identreprise": number,
    "isConfirme": boolean,
    "typeMfa": boolean,
    "token": string,
    "statut": true,
    "userRoles": number[],
    "statutMfa":boolean
  }