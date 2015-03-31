module BD.APP {

    export interface IProductDef {
        logic: string[]; visual: string;  weight: number;
    }
    export class AppParams {
        partnerCode:string;
        subId:string;
        providerName:string;
        providerLink:string;
        providerFooter:string;
        products:{[index:string]: IProductDef[]};
    }
}

