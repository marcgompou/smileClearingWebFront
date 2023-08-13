import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dataTablePipe'
})
export class DataTablePipe implements PipeTransform {
    transform(value: any, transformType: any): any {
        if (!value) return value;

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

    private formatAmount(amount: number): string {
        return `$${amount.toFixed(2)}`;
    }

    private formatDate(date: Date): string {
        const pipe = new DatePipe('fr');
        return pipe.transform(date, 'medium');
    }
}
