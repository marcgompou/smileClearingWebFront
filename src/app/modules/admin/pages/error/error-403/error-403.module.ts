import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Error403Component } from 'app/modules/admin/pages/error/error-403/error-403.component';
import { error403Routes } from 'app/modules/admin/pages/error/error-403/error-403.routing';

@NgModule({
    declarations: [
        Error403Component
    ],
    imports     : [
        RouterModule.forChild(error403Routes),
        MatIconModule
    ]
})
export class Error403Module
{
}
