/// <reference path="IStore.ts"/>
/// <reference path="Promise.ts"/>

module BD.APP.Common {

    export interface IUserStore extends IStore{
        uuid():string
        reload():Common.Promise<void>;
    }

}