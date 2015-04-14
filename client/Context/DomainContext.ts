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
/// <reference path="../Common/CountryHelper"/>

module BD.APP.Context {

    export class DomainContext extends AppContext implements IAppContext {

        private _countryCode:string;
        private _userSettings:Common.IUserStore;
        private _suspender:Common.ISuspender;
        private _scraper:Common.IPageScraper;
        private _iframe:Common.IFrameStore;

        private _fnWindow:Window;

        countryCode():string { return this._countryCode; }

        userSettings():Common.IUserStore { return this._userSettings; }
        suspender():Common.ISuspender {  return this._suspender; }
        scraper():Common.IPageScraper {  return this._scraper; }
        iframe():Common.IFrameStore {  return this._iframe; }
        fnWindow():Window { return this._fnWindow }

        constructor(baseContext:IBaseContext, countryCode:string,  userSettings:Common.IUserStore, suspender:Common.ISuspender, iframe:Common.IFrameStore, fnWindow:Window) {
            super(baseContext.paths(), baseContext.params());

			this._countryCode = countryCode;
            this._userSettings = userSettings;
            this._suspender = suspender;
            this._iframe = iframe;
            this._scraper = new Common.DefaultPageScraper();
            this._fnWindow = window;
        }

        notificationParams():{[index:string]: string} {
            var contextParams = super.notificationParams();
            contextParams['hid'] = this.userSettings().uuid();
            contextParams['cc'] = this.countryCode();

            return contextParams;
        }

        static initializePromise(baseContext:IBaseContext, userSettingsPromise:Common.Promise<Common.IUserStore>, suspenderPromise:Common.Promise<Common.ISuspender>,
                                 iframe:Common.IFrameStore, fnWindow:Window):Common.Promise<DomainContext> {

            var getCountryPromise = Common.CountryHelper.getCountryPromise(baseContext);


            return Common.namedWhen2({'CC': getCountryPromise, 'US': userSettingsPromise, 'SU': suspenderPromise}).then((res) => {
                var countryCode:string = res['CC'];
                var userSettings:Common.IUserStore = res['US'];
                var suspender:Common.ISuspender = res['SU'];

                return new DomainContext(baseContext, countryCode, userSettings, suspender, iframe, fnWindow);
            });
        }

    }

}
