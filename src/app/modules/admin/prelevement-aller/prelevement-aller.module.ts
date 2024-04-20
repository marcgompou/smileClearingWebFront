import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PrelevementAllerComponent } from "./prelevement-aller/prelevement-aller.component";
import { RouterModule } from "@angular/router";
import { prelevementAller } from "./prelevement-aller.routing";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatRadioModule } from "@angular/material/radio";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { FuseFindByKeyPipeModule } from "@fuse/pipes/find-by-key";
import { SharedModule } from "app/shared/shared.module";
import { MatPaginatorModule } from "@angular/material/paginator";
import { FuseAlertModule } from "@fuse/components/alert";
import { TableDataModule } from "../common/table-data/table-data.module";

@NgModule({
  declarations: [PrelevementAllerComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDividerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatRadioModule,
    MatTableModule,
    MatTooltipModule,
    FuseFindByKeyPipeModule,
    SharedModule,
    MatAutocompleteModule,
    FuseAlertModule,
    TableDataModule,
    RouterModule.forChild(prelevementAller),
  ],
})
export class PrelevementAllerModule {}
