/// <reference path="IPaths"/>
/// <reference path="../AppParams"/>

module BD.APP.Context {


    export interface IBaseContext {
        paths():IPaths;
        params():AppParams;
        host():string;

        isDebugMode():boolean;

    }
}
