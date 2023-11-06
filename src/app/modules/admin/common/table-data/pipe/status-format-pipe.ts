import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'statusFormatPipe'
})
export class StatusFormatPipe implements PipeTransform {
    transform(value: any, transformType: any): any {
        console.log("==value==>",value);
        console.log("==transformType==>",transformType);
        if (value===null || value===undefined || value===""){
            value= "-";
        } 
        else{

            let index = transformType.findIndex(item => item.value == value);
            return index>-1 ? transformType[index]?.libelle : value;
        }
    }
}
