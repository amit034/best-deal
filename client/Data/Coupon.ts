module BD.APP.Data {

    export interface Coupon {
        url:string;
        title:string;
        keywords:string;
        onClick?:() => void;
        merchant: string;
        merchantImage: string;
        revealed: boolean;
        code: string;
        isDirect: boolean;
        partialCode:string;
    }
}
