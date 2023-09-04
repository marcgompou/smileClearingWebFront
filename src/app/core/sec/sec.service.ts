import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SecService
{
    static permissions = {
        ROLE_SCAN: "EXPORTATION", 
        //ROLE_SCAN: "SCAN", 
        ROLE_ADMIN: "ADMIN",
        ROLE_EXPORT:"EXPORTATION",
        ROLE_CONSULT:"VISUALISATION",
        ROLE_VISU_RETOUR:"EXPORTATION",
        ROLE_SUPERADMIN:"EXPORTATION",
        ROLE_VALID:"VALIDATION",
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
