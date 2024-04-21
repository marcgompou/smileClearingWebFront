import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SecService
{
    static permissions = {
        ROLE_VISUALISATION:"VISUALISATION",
        ROLE_CHARG_PRELEVEMENT:"CHARG_PRELEVEMENT",
        ROLE_EXPORTATION:"EXPORTATION",
        ROLE_VALID_PRELEVEMENT:"VALID_PRELEVEMENT",
        ROLE_VALIDATION:"VALIDATION",
        ROLE_SUPERADMIN:"SUPERADMIN",
        ROLE_CREATION:"CREATION",
        ROLE_ADMIN:"ADMIN",
        ROLE_VALID_SALAIRE:"VALID_SALAIRE",
        ROLE_CHARG_SALAIRE:"CHARG_SALAIRE",
        ROLE_VALID_PRELEVEMENT_INTER_BANK:"VALID_PRELEVEMENT_INTER_BANK",
        ROLE_CONSULT_AFB120:"CONSULT_AFB120",
        ROLE_CHARG_PRELEVEMENT_INTER_BANK:"CHARG_PRELEVEMENT_INTER_BANK",
        ROLE_CONSULT_SALAIRE :"CONSULT_SALAIRE",
        ROLE_CONSULT_VALEUR_SALAIRE:"CONSULT_VALEUR_SALAIRE",
    }
    
    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient
    )
    {
    }

}
