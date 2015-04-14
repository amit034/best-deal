/// <reference path="Collection.ts" />


module BD.APP.Common {


    export interface IMerchant  {
        text :string;
        image:string;
    }

    export class MerchantHelper {
		
		private static  merchantPerformers : IMerchant[] = [{text :"Book now and get" , image:"10% OFF" }];
		  
        private static  merchantOffers : IMerchant[] = [{text :"Book now and get Up to 14% off" , image:"14% OFF" },
                                                        {text :"Book now and get Up to 19% off" , image:"19% OFF" },
                                                        {text :"Book now and get Up to 22% off" , image:"22% OFF" },
                                                        {text :"Book now and get Up to 29% off" , image:"29% OFF" },
                                                        {text :"Book now and get Up to 33% off" , image:"33% OFF" }];


        static getPerformersMerchant():IMerchant{
                return  this.merchantPerformers[Math.floor(Math.random()* this.merchantPerformers.length)];
//                var merchantOffer:IMerchant = this.merchantOffers[Math.floor(Math.random()* this.merchantOffers.length)];
//                return {
//                    text: merchantPerformer.text + " " + merchantOffer.text,
//                    image : merchantOffer.image
//                };
        }
		
		
		static getOffersMerchant():IMerchant{

                return this.merchantOffers[Math.floor(Math.random()* this.merchantOffers.length)];
        }



    }

}
