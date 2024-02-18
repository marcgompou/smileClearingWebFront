import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionComponent } from './transaction-bancaire/transaction-bancaire/transaction-bancaire.component';
import { RouterModule } from '@angular/router';
import { transactionRoutes } from './transaction-bancaire.routing';
import { SharedModule } from 'app/shared/shared.module';
import { TransactionBancaireComponent } from './transaction-bancaire/transaction-bancaire.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { TableDataModule } from '../common/table-data/table-data.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DetailsTransactionComponent } from './transaction-bancaire/details-transaction/details-transaction.component';
import { DetailsComponent } from '../common/details/details/details.component';
import { DetailsModule } from '../common/details/details.module';
import { MatDialogModule } from '@angular/material/dialog';
import { DetailsImprimerComponent } from '../imprimer-remise/details-importation/details-imprimer.component';
import { FuseAlertModule } from '@fuse/components/alert';



@NgModule({
  declarations: [
  TransactionBancaireComponent,
   TransactionComponent,
   DetailsTransactionComponent,
  //  DetailsImprimerComponent,
  ],
  exports:[DetailsTransactionComponent],
  imports: [
    CommonModule,
        MatButtonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatDividerModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatMomentDateModule,
        MatProgressBarModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatTableModule,
        MatTooltipModule,
        FuseFindByKeyPipeModule,
        SharedModule,
        TableDataModule,
        DetailsModule,
        MatAutocompleteModule,
        FuseAlertModule,
        RouterModule.forChild(transactionRoutes)

  ]
})
export class TransactionBancaireModule { }
