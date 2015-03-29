/// <reference path="IStore.ts" />
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Common;
        (function (Common) {
            var DefaultSuspender = (function () {
                function DefaultSuspender(userSettings) {
                    this.userSettings = userSettings;
                }
                DefaultSuspender.prototype.isSuspended = function (suspendIdentifier) {
                    var suspendedMap = this.userSettings.retrive(DefaultSuspender.SUSPENDED_KEY);
                    var now = new Date().getTime();
                    if (suspendedMap && suspendIdentifier in suspendedMap && 'timestamp' in suspendedMap[suspendIdentifier]) {
                        var suspendedUntil = suspendedMap[suspendIdentifier]['timestamp'];
                        return (suspendedUntil == -1 || suspendedUntil > now);
                    }
                    else {
                        if (suspendedMap) {
                            if (suspendIdentifier in suspendedMap && 'timestamp' in suspendedMap[suspendIdentifier]) {
                                var suspendedUntil = suspendedMap[suspendIdentifier]['timestamp'];
                                APP.Logger.log("Suspension found, but expired on " + new Date(suspendedUntil).toUTCString());
                            }
                            else {
                                APP.Logger.log("Suspension id " + suspendIdentifier + " not in suspension map");
                            }
                        }
                        else {
                            APP.Logger.log("No suspension map found");
                        }
                        return false;
                    }
                };
                DefaultSuspender.prototype.shouldAutoAppear = function (suspendIdentifier) {
                    var suspendedMap = this.userSettings.retrive(DefaultSuspender.SUSPENDED_KEY);
                    if (suspendedMap && suspendIdentifier in suspendedMap && 'autoAppear' in suspendedMap[suspendIdentifier] && suspendedMap[suspendIdentifier]['autoAppear'] == false) {
                        return false;
                    }
                    return true;
                };
                DefaultSuspender.prototype.suspend = function (suspendIdentifier, ms) {
                    var suspendedMap = this.userSettings.retrive(DefaultSuspender.SUSPENDED_KEY);
                    if (suspendedMap == null)
                        suspendedMap = {};
                    var now = new Date().getTime();
                    var suspendUntil = now + ms;
                    if (!suspendedMap[suspendIdentifier])
                        suspendedMap[suspendIdentifier] = {};
                    suspendedMap[suspendIdentifier]['timestamp'] = suspendUntil;
                    APP.Logger.log("Suspended " + suspendIdentifier + " until " + new Date(suspendUntil).toUTCString());
                    this.userSettings.store(DefaultSuspender.SUSPENDED_KEY, suspendedMap);
                };
                DefaultSuspender.millisecondsToStr = function (milliseconds) {
                    function numberEnding(number) {
                        return (number > 1) ? 's' : '';
                    }
                    var temp = Math.floor(milliseconds / 1000);
                    var years = Math.floor(temp / 31536000);
                    if (years) {
                        return years + ' year' + numberEnding(years);
                    }
                    //TODO: Months! Maybe weeks?
                    var days = Math.floor((temp %= 31536000) / 86400);
                    if (days) {
                        return days + ' day' + numberEnding(days);
                    }
                    var hours = Math.floor((temp %= 86400) / 3600);
                    if (hours) {
                        return hours + ' hour' + numberEnding(hours);
                    }
                    var minutes = Math.floor((temp %= 3600) / 60);
                    if (minutes) {
                        return minutes + ' minute' + numberEnding(minutes);
                    }
                    var seconds = temp % 60;
                    if (seconds) {
                        return seconds + ' second' + numberEnding(seconds);
                    }
                    return 'less than a second'; //'just now' //or other string you like;
                };
                DefaultSuspender.SUSPENDED_KEY = "suspend";
                return DefaultSuspender;
            })();
            Common.DefaultSuspender = DefaultSuspender;
        })(Common = APP.Common || (APP.Common = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
