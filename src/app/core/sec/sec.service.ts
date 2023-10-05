import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SecService
{
    static permissions = {
         ROLE_SCAN: "EXPORTATION", 
        // //ROLE_SCAN: "SCAN", 
        // ROLE_ADMIN: "ADMIN",
        // ROLE_EXPORT:"EXPORTATION",
        // ROLE_CONSULT:"VISUALISATION",
        // ROLE_VISU_RETOUR:"EXPORTATION",
        // ROLE_SUPERADMIN:"EXPORTATION",
        // ROLE_VALID:"VALIDATION",

        ROLE_VISUALISATION:"VISUALISATION",
        ROLE_CHARG_PRELEVEMENT:"CHARG_PRELEVEMENT",
        ROLE_EXPORTATION:"EXPORTATION",
        ROLE_VALID_PRELEVEMENT:"VALID_PRELEVEMENT",
        ROLE_VALIDATION:"VALIDATION",
        ROLE_SUPERADMIN:"SUPERADMIN",
        ROLE_CREATION:"CREATION",
        ROLE_ADMIN:"ADMIN",
    }
    //EXPORTATION
    //SUPERADMIN
    //CREATION
    //VALIDATION
    //ADMIN
    //VISUALISATION
    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient
    )
    {
    }

}
