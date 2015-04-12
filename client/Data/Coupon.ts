module BD.APP.Data {

    export interface CouponImage{
        src:string;
        height:number;
        width :number;
    }

    export interface Coupon {
        script:string;
		link:string;
        image : CouponImage;
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
