/// <reference path="../Common/IUserStore" />
/// <reference path="../Common/ISuspender" />
/// <reference path="../Common/IPageScraper" />
/// <reference path="../Common/IFrameStore.ts" />
module BD.APP.Context {

    export interface IAppContext  extends IBaseContext{

        userSettings():Common.IUserStore;
        suspender():Common.ISuspender;
        scraper():Common.IPageScraper;
        fnWindow():Window;
        iframe():Common.IFrameStore;
        countryCode():string
    }


}