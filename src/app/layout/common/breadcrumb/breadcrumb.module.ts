import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'app/shared/shared.module';
import { BreadcrumbComponent } from './breadcrumb.component';

@NgModule({
    declarations: [
        BreadcrumbComponent
    ],
    imports     : [
        MatButtonModule,
        MatIconModule,
        SharedModule
    ],
    exports     : [
        BreadcrumbComponent
    ]
})
export class BreadcrumbModule
{
}
