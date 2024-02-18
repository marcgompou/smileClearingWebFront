import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {TableDataComponent} from './table-data.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { DataTablePipe } from './pipe/data-table-pipe';
import { StatusFormatPipe } from './pipe/status-format-pipe';
import { StatusPillDirective } from './directive/status-pill.directive';
import { MatIcon, MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    TableDataComponent,
    
    DataTablePipe,
    StatusFormatPipe,
    StatusPillDirective //DIRECTIVE POUR AFFICHER LES STATUTS SOUS FORMS DE PILLS
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule, // <-- Added Paginator Module
    MatProgressBarModule,
    MatIconModule
  ],
  exports:[
    TableDataComponent
  ]
})
export class TableDataModule { }
