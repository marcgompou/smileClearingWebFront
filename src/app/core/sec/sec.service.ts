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
