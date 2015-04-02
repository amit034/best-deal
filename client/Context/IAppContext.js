/// <reference path="IBaseContext"/>
/// <reference path="../Common/IUserStore"/>
/// <reference path="../Common/ISuspender"/>
/// <reference path="../Common/IIframe"/>
/// <reference path="../Common/IPageScraper.ts"/>


module FO.Shared.Context {

export interface IAppContext extends IBaseContext  {
        countryCode():string;

        userSettings():Common.IUserStore;
        suspender():Common.ISuspender;
        scraper():Common.IPageScraper;
        iframe():Common.IIframe;
        fnWindow():Window;
    }


}