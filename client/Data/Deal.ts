module BD.APP.Data {

    export interface Deal{
        title:string;
        url:string;
        keywords:string;
        onClick?:() => void;
        merchant: string;
        merchantImage: string;
    }
    export interface Pricing{
    listing:number;
    avg:number;
    lowest:number;
    highest:number;
    }
    export interface Images{
        largeImage:string;
        huge:string;
        small:string;
        medium:string;
    }
    export interface Event extends Deal {
        prices:Pricing;
        image:string;

    }

    export interface Performers extends Deal {
        image:string;
        images : Images;
    }


}
