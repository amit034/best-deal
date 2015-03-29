/// <reference path="IUserStore" />
/// <reference path="CommonHelper" />
/// <reference path="../External/JSON3" />
/// <reference path="IAsyncStore" />
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Common;
        (function (Common) {
            var LooseUserSettings = (function () {
                function LooseUserSettings(asyncStore, data) {
                    this.asyncStore = asyncStore;
                    this.data = data;
                }
                LooseUserSettings.prototype.uuid = function () {
                    return this.data["uuid"];
                };
                LooseUserSettings.prototype.retrive = function (key) {
                    return this.data[key];
                };
                LooseUserSettings.prototype.store = function (key, value) {
                    this.data[key] = value;
                    this.commitChanges();
                };
                LooseUserSettings.prototype.remove = function (key) {
                    delete this.data[key];
                    this.commitChanges();
                };
                LooseUserSettings.prototype.retriveAndRemove = function (key) {
                    var value = this.data[key];
                    delete this.data[key];
                    this.commitChanges();
                    return value;
                };
                LooseUserSettings.prototype.reload = function () {
                    var _this = this;
                    return this.asyncStore.retrieve(LooseUserSettings.USER_SETTINGS_KEY).alwaysThen(function (data, err) {
                        if (err) {
                            if (err)
                                APP.Logger.warn("Failed reloading userSetting.");
                        }
                        else {
                            _this.data = data;
                        }
                    });
                };
                LooseUserSettings.prototype.commitChanges = function () {
                    this.asyncStore.store(LooseUserSettings.USER_SETTINGS_KEY, this.data);
                    // Save to local storage for fallback
                    localStorage.setItem(LooseUserSettings.USER_SETTINGS_KEY, JSON3.stringify(this.data));
                };
                LooseUserSettings.fromAsyncStorePromise = function (asyncStore, defaultUUID) {
                    var defautValue = { uuid: defaultUUID, suspend: {} };
                    return asyncStore.retrieveOrSet(LooseUserSettings.USER_SETTINGS_KEY, defautValue).alwaysThen(function (data, err) {
                        var settings = null;
                        if (err) {
                            APP.Logger.warn("Failed getting real userSetting using default: " + (err && err.message));
                            // Try and get from local storage
                            var rawLocal = localStorage.getItem(LooseUserSettings.USER_SETTINGS_KEY);
                            var local = null;
                            try {
                                local = JSON3.parse(rawLocal);
                            }
                            catch (e) {
                            }
                            // Sanity check - we expect at least a uuid property
                            if (local && local["uuid"]) {
                                APP.Logger.warn("Using localStorage info in place of iframe settings:");
                                APP.Logger.info(rawLocal);
                                settings = local;
                            }
                            else {
                                APP.Logger.info("localStorage info missing or misshaped will use default values for user settings");
                                settings = defautValue;
                            }
                        }
                        else {
                            APP.Logger.info("Using true iframe data for user settings");
                            settings = data;
                            // Save to local storage for fallback
                            localStorage.setItem(LooseUserSettings.USER_SETTINGS_KEY, JSON3.stringify(data));
                        }
                        return new LooseUserSettings(asyncStore, settings);
                    }).fail(function (e) {
                        APP.Logger.error("Failed loading async store for userSettings: " + e.message);
                    });
                    //return asyncStore.retrieveOrSet(UserSettings.USER_SETTINGS_KEY, defautValue).then((data) => {
                    //    return new UserSettings(asyncStore, data);
                    //}).fail((e) => {
                    //    Logger.error("Failed loading async store for userSettings: " + e.message);
                    //});
                };
                LooseUserSettings.USER_SETTINGS_KEY = "userSettings";
                return LooseUserSettings;
            })();
            Common.LooseUserSettings = LooseUserSettings;
        })(Common = APP.Common || (APP.Common = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
