/// <reference path="Promise.ts"/>

module BD.APP.Common {

    export interface IAsyncStore<T> {
        retrieve(key:string): Common.Promise<T>;
        retrieveOrSet(key:string, value:any): Common.Promise<T>;
        store(key:string, data:T):void;
    }

}
