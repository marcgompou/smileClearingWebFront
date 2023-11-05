import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'statusFormatPipe'
})
export class StatusFormatPipe implements PipeTransform {
    transform(value: any, transformType: any): any {
        if (!value) return "-";
        else{
            let index = transformType.findIndex(item => item.value == value);
            return index>-1 ? transformType[index]?.libelle : value;
        }
    }
}
