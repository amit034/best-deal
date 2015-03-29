
/// <reference path="IUserStore" />
/// <reference path="CommonHelper" />
/// <reference path="../External/JSON3" />
/// <reference path="IAsyncStore" />

module BD.APP.Common {

    export class LooseUserSettings implements IUserStore{

        static USER_SETTINGS_KEY = "userSettings";


        private asyncStore:IAsyncStore<any>;
        private data: {[index:string]: any};


        uuid():string {
            return this.data["uuid"];
        }

        retrive<T>(key: string): T {
            return this.data[key];
        }

        store(key: string, value: any) {
            this.data[key] = value;
            this.commitChanges();
        }

        remove(key:string) {
            delete this.data[key];
            this.commitChanges();
        }

        retriveAndRemove<T>(key: string): T {
            var value:T = this.data[key];
            delete  this.data[key];
            this.commitChanges();

            return value;
        }

        reload():Common.Promise<void> {
            return this.asyncStore.retrieve(LooseUserSettings.USER_SETTINGS_KEY).alwaysThen<void>((data:{[index:string]: any}, err: Rejection) => {
                if (err) {
                    if (err) Logger.warn("Failed reloading userSetting.");
                }
                else {
                    this.data = data;
                }
            });
        }



        constructor(asyncStore:IAsyncStore<any>, data: {[index:string]: any}) {
            this.asyncStore = asyncStore;
            this.data = data;
        }

        private commitChanges() {
            this.asyncStore.store(LooseUserSettings.USER_SETTINGS_KEY, this.data);

            // Save to local storage for fallback
            localStorage.setItem(LooseUserSettings.USER_SETTINGS_KEY, JSON3.stringify(this.data));
        }


        static fromAsyncStorePromise(asyncStore:IAsyncStore<any>, defaultUUID:string): Common.Promise<LooseUserSettings> {
            var defautValue:{[index:string]: any} = {uuid: defaultUUID, suspend: {}};

            return asyncStore.retrieveOrSet(LooseUserSettings.USER_SETTINGS_KEY, defautValue).alwaysThen<LooseUserSettings>((data:{[index:string]: any}, err:Rejection) => {
                var settings:{[index:string]: any} = null;

                if (err) {
                    Logger.warn("Failed getting real userSetting using default: " + (err && err.message));

                    // Try and get from local storage
                    var rawLocal = localStorage.getItem(LooseUserSettings.USER_SETTINGS_KEY);
                    var local = null;
                    try {
                        local = JSON3.parse(rawLocal);
                    }
                    catch (e) {}

                    // Sanity check - we expect at least a uuid property
                    if (local && local["uuid"]) {
                        Logger.warn("Using localStorage info in place of iframe settings:");
                        Logger.info(rawLocal);
                        settings = local;
                    }
                    else {
                        Logger.info("localStorage info missing or misshaped will use default values for user settings");
                        settings = defautValue;
                    }
                }
                else {
                    Logger.info("Using true iframe data for user settings");
                    settings = data;

                    // Save to local storage for fallback
                    localStorage.setItem(LooseUserSettings.USER_SETTINGS_KEY, JSON3.stringify(data));
                }

                return new LooseUserSettings(asyncStore, settings);

            }).fail((e) => {
                Logger.error("Failed loading async store for userSettings: " + e.message);
            });


            //return asyncStore.retrieveOrSet(UserSettings.USER_SETTINGS_KEY, defautValue).then((data) => {
            //    return new UserSettings(asyncStore, data);
            //}).fail((e) => {
            //    Logger.error("Failed loading async store for userSettings: " + e.message);
            //});
        }




    }


}
