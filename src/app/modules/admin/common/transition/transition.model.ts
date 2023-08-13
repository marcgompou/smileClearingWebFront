export class Etat {

    code:string;
    libelle:string;
    colors:string;

    /**
     * 
     * @param code 
     * @param libelle 
     * @param colors 
     */
    constructor(code:string, libelle:string, colors:string) {
        this.code = code;
        this.libelle = libelle;
        this.colors = colors;
    }
}

export class Transition {

    code:string;
    libelle:string;
    origine:Etat;
    destination:Etat;
    role:string;

    btn_icon:string;
    btn_color:string;
    endpoint:string;
    decision?:boolean;


    /**
     * 
     * @param libelle 
     * @param origine 
     * @param destination 
     * @param role 
     * @param btn_icon 
     * @param btn_color 
     * @param endpoint 
     * @param decision 
     */
    constructor(libelle:string, origine:Etat, destination:Etat, role:string, btn_icon:string, btn_color:string, endpoint:string,decision?:boolean) {
        this.code = origine.code + "_vers_" + destination.code;
        this.libelle = libelle;
        this.origine = origine;
        this.destination = destination;
        this.role = role;
        this.btn_icon = btn_icon;
        this.btn_color = btn_color;
        this.endpoint = endpoint;
        this.decision = decision;
    }
}
