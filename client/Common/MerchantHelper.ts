/// <reference path="Collection.ts" />


module BD.APP.Common {


    export interface IMerchant  {
        text :string;
        image:string;
    }

    export class MerchantHelper {

        private static  merchantOffers : IMerchant[] = [{text :"22% off Orders" , image:"22off.jpg" },
          {text :"Best price guarantee , book with confidence" , image:"" }];


        static getMerchant():IMerchant{

                return this.merchantOffers[Math.floor(Math.random()* this.merchantOffers.length)];
        }




    }

}
