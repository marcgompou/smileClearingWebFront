import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {TableDataComponent} from './table-data.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { DataTablePipe } from './pipe/data-table-pipe';


@NgModule({
  declarations: [
    TableDataComponent,
    DataTablePipe
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule, // <-- Added Paginator Module
    MatProgressBarModule
  ],
  exports:[
    TableDataComponent
  ]
})
export class TableDataModule { }
