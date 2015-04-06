/// <reference path="Collection.ts" />


module BD.APP.Common {


    export interface IMerchant  {
        text :string;
        image:string;
    }

    export class MerchantHelper {
		
		private static  merchantPerformers : IMerchant[] = [{text :"Best price guarantee , book with confidence" , image:"10% OFF" }];
		  
        private static  merchantOffers : IMerchant[] = [{text :"22% off Orders" , image:"22% OFF" },
          {text :"15% off Orders" , image:"15% OFF" }];


        static getPerformersMerchant():IMerchant{

                return this.merchantPerformers[Math.floor(Math.random()* this.merchantPerformers.length)];
        }
		
		
		static getOffersMerchant():IMerchant{

                return this.merchantOffers[Math.floor(Math.random()* this.merchantOffers.length)];
        }



    }

}
