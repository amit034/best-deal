module BD.APP.Data {

    export interface Coupon {
        script:string;
		link:string;
		image:string;		
        title:string;
		url:string;
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
