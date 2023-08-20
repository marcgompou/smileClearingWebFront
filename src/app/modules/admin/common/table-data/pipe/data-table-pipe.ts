import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dataTablePipe'
})
export class DataTablePipe implements PipeTransform {
    transform(value: any, transformType: any): any {
        if (!value) return "-";

        if (transformType === 'montant') {
            // Implement the logic for the 'amount' transformation
            // For example, you might want to format numbers as currency
            return this.formatAmount(value);
        } else if (transformType === 'date') {
            // Implement the logic for the 'date' transformation
            // For example, you might want to format dates using a specific pattern
            return this.formatDate(value);
        }

        return value;
    }

    private formatAmount(amount: number | string ): string {

        if (typeof amount !== "number") {
            const amountNew = parseInt(amount, 10);
            return `${amountNew.toFixed(0)}`;
         }else
         //retourner le resulta
         return `${amount.toFixed(0)}`;
     
        
    }

    

    private formatDate(date: Date): string {
        const pipe = new DatePipe('fr');
        return pipe.transform(date, 'medium');
    }
}
