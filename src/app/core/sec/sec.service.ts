import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SecService
{
    static permissions = {
        ROLE_SCAN: "ADMIN", 
        //ROLE_SCAN: "SCAN", 
        ROLE_ADMIN: "ADMIN",
        ROLE_EXPORT:"ADMIN",
        ROLE_CONSULT:"VISUALISATION",
        ROLE_VISU_RETOUR:"SUPERADMIN",
        ROLE_SUPERADMIN:"SUPERADMIN",
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
