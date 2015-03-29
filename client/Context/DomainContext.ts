/// <reference path="AppContext"/>
/// <reference path="IAppContext"/>
/// <reference path="IBaseContext.ts"/>
/// <reference path="../External/JSON3" />
/// <reference path="../Common/IUserStore" />
/// <reference path="../Common/ISuspender" />
/// <reference path="../Common/IPageScraper" />
/// <reference path="../Common/IFrameStore.ts" />
/// <reference path="../Common/DefaultPageScraper.ts" />
/// <reference path="../Common/Promise.ts" />
module BD.APP.Context {

    export class DomainContext extends AppContext implements IAppContext {

        private _userSettings:Common.IUserStore;
        private _suspender:Common.ISuspender;
        private _scraper:Common.IPageScraper;
        private _iframe:Common.IFrameStore;

        private _fnWindow:Window;


        userSettings():Common.IUserStore { return this._userSettings; }
        suspender():Common.ISuspender {  return this._suspender; }
        scraper():Common.IPageScraper {  return this._scraper; }
        iframe():Common.IFrameStore {  return this._iframe; }
        fnWindow():Window { return this._fnWindow }

        constructor(baseContext:IBaseContext,  userSettings:Common.IUserStore, suspender:Common.ISuspender, iframe:Common.IFrameStore, fnWindow:Window) {
            super(baseContext.paths(), baseContext.params());


            this._userSettings = userSettings;
            this._suspender = suspender;
            this._iframe = iframe;
            this._scraper = new Common.DefaultPageScraper();
            this._fnWindow = window;
        }



        static initializePromise(baseContext:IBaseContext, userSettingsPromise:Common.Promise<Common.IUserStore>, suspenderPromise:Common.Promise<Common.ISuspender>,
                                 iframe:Common.IFrameStore, fnWindow:Window):Common.Promise<DomainContext> {

            return Common.namedWhen2({'US': userSettingsPromise, 'SU': suspenderPromise}).then((res) => {

                var userSettings:Common.IUserStore = res['US'];
                var suspender:Common.ISuspender = res['SU'];

                return new DomainContext(baseContext, userSettings, suspender, iframe, fnWindow);
            });
        }

    }

}
