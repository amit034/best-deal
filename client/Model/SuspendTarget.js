var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Model;
        (function (Model) {
            var SuspendTarget = (function () {
                function SuspendTarget(context, suspendIdentifier, suspendPeriods, closeFn) {
                    this.context = null;
                    this.suspendIdentifier = null;
                    this.suspendPeriods = null;
                    this.suspendPeriods = suspendPeriods;
                    this.selectedPeriodMS = BD.ko.observable(this.suspendPeriods[0].ms);
                    this.context = context;
                    this.suspendIdentifier = suspendIdentifier;
                    this.closeFn = closeFn;
                }
                SuspendTarget.prototype.shouldAutoAppear = function () {
                    return this.context.suspender().shouldAutoAppear(this.suspendIdentifier);
                };
                SuspendTarget.prototype.applySelectedSuspension = function () {
                    this.suspend(this.selectedPeriodMS());
                };
                SuspendTarget.prototype.suspend = function (ms) {
                    this.context.suspender().suspend(this.suspendIdentifier, ms);
                    this.closeFn();
                    //location.reload();
                };
                SuspendTarget.prototype.openSuspendWindow = function () {
                    // todo: _foss refers to sidebar - need to generalize this!!!!!!
                    var suspendWindowUrl = APP.Common.stringFormat("http://removemyapp.info/suspend.html?hid={0}&contact={1}", this.context.userSettings().uuid(), encodeURIComponent(this.context.params().providerLink));
                    var suspendWindowParams = 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=730, height=400';
                    var suspenderWindow = window.open(suspendWindowUrl, '', suspendWindowParams);
                    var self = this;
                    var intervalId = window.setInterval(function () {
                        var handled = SuspendTarget.checkSuspendWindowClosed(self, suspenderWindow, self.closeFn);
                        if (handled) {
                            window.clearInterval(intervalId);
                        }
                    }, 500);
                };
                SuspendTarget.checkSuspendWindowClosed = function (self, suspendWindow, closeFn) {
                    if (suspendWindow && suspendWindow.closed) {
                        self.context.userSettings().reload().then(function () {
                            var isSuspended = self.context.suspender().isSuspended(self.suspendIdentifier);
                            var autoAppear = self.context.suspender().shouldAutoAppear(self.suspendIdentifier);
                            APP.Logger.log("Suspend advanced window closed. Suspended: " + isSuspended + ". AutoAppear: " + autoAppear);
                            if (isSuspended) {
                                closeFn();
                            }
                        });
                        return true;
                    }
                    return false;
                };
                SuspendTarget.prototype.openSuspendWindow_new = function () {
                    var _this = this;
                    // todo: _foss refers to sidebar - need to generalize this!!!!!!
                    var suspendWindowUrl = APP.Common.stringFormat("http://removemyapp.info/suspend.html?hid={0}}&contact={1}", this.context.userSettings().uuid(), encodeURIComponent(this.context.params().providerLink));
                    var suspendWindowParams = 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=730, height=400';
                    var suspenderWindow = window.open(suspendWindowUrl, '', suspendWindowParams);
                    var intervalId = window.setInterval(function () {
                        if (suspenderWindow && suspenderWindow.closed) {
                            _this.context.userSettings().reload().then(function () {
                                var isSuspended = _this.context.suspender().isSuspended(_this.suspendIdentifier);
                                var autoAppear = _this.context.suspender().shouldAutoAppear(_this.suspendIdentifier);
                                APP.Logger.log("Suspend advanced window closed. Suspended: " + isSuspended + ". AutoAppear: " + autoAppear);
                                if (isSuspended) {
                                    _this.closeFn();
                                }
                            });
                            window.clearInterval(intervalId);
                        }
                    }, 500);
                };
                SuspendTarget.defaultSuspendPeriods = [
                    { text: '1 Hour', ms: 3600000 },
                    { text: '1 Day', ms: 86400000 },
                    { text: '1 Week', ms: 604800000 }
                ];
                SuspendTarget.strictSuspendPeriods = [
                    { text: '1 Day', ms: 86400000 },
                    { text: '1 Week', ms: 6048000000 },
                    { text: 'Forever', ms: 3155692597470 },
                ];
                return SuspendTarget;
            })();
            Model.SuspendTarget = SuspendTarget;
        })(Model = APP.Model || (APP.Model = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
