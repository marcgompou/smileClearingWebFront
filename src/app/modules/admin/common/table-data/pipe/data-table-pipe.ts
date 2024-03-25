import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dataTablePipe'
})
export class DataTablePipe implements PipeTransform {
    transform(value: any, transformType: any): any {
        if (!value) return "-";

        if (transformType === 'montant') {
            return this.formatAmount(value);
        } else if (transformType === 'date') {
            return this.formatDate(value);
        }

        return value;
    }

    private formatAmount(amount: number | string ): string {
        console.log("==type amount==>",typeof amount);
        if (typeof amount !== "number") {
          
                const amountNew = parseInt(amount, 10);
                if ( isNaN(amountNew) ) {
                    return amount;
                }
                return `${amountNew.toFixed(0)}`;
            

         }
         
         else
         //retourner le resulta
         return `${amount.toFixed(0)}`;
     
        
    }

    

    private formatDate(date: Date): string {
        const pipe = new DatePipe('fr');
        return pipe.transform(date, 'medium');
    }
}
