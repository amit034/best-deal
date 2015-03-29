
module BD.APP.Common {

    export interface IStore {
        retrive<T>(key: string): T;
        store(key: string, value: any);
        remove(key:string);

        retriveAndRemove<T>(key: string): T;


    }

}