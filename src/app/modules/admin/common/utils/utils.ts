export class Utils{
    public static delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    public static isInclude(valueToCheck:any,liste:Record<string,any>[],searckey:string):boolean{
        for(let element of liste){
            if(element[searckey] === valueToCheck){
                return true;
            }
        }
        return false;
    }

    public static isIncludeInList(liste:Record<string,any>[],key1:string,valuekey1:any,key2?:string,valuekey2?:any):boolean{
        
        for(let element of liste){
            if(element[key1] === valuekey1){
                if(key2){
                    if(element[key2] === valuekey2){
                        return true;
                    }else{
                        return false;
                    }  
                }
                return true;
            }
        }
        return false;
    }
}