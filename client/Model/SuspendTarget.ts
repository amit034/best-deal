
module BD.APP.Model {

    export interface SuspendPeriods extends Array<{text:string; ms:number}> {
    }

    export class SuspendTarget {

        private context:Context.IAppContext = null;
        private suspendIdentifier:string = null;

        closeFn:() => void;

        static defaultSuspendPeriods:SuspendPeriods = [
            {text: '1 Hour', ms: 3600000},
            {text: '1 Day', ms: 86400000},
            {text: '1 Week', ms: 604800000}
        ];

        static strictSuspendPeriods:SuspendPeriods = [
            {text: '1 Day', ms: 86400000},
            {text: '1 Week', ms: 6048000000},
            {text: 'Forever', ms: 3155692597470},
        ];

        suspendPeriods = null;


        selectedPeriodMS:KnockoutObservable<number>;


        constructor(context:Context.IAppContext, suspendIdentifier:string, suspendPeriods:SuspendPeriods, closeFn:() => void) {

            this.suspendPeriods = suspendPeriods;
            this.selectedPeriodMS = ko.observable(this.suspendPeriods[0].ms);

            this.context = context;
            this.suspendIdentifier = suspendIdentifier;

            this.closeFn = closeFn;
        }

        shouldAutoAppear():boolean {
            return this.context.suspender().shouldAutoAppear(this.suspendIdentifier);
        }

        applySelectedSuspension() {
            this.suspend(this.selectedPeriodMS());
        }

        suspend(ms:number) {
            this.context.suspender().suspend(this.suspendIdentifier, ms);
            this.closeFn();
            //location.reload();
        }

        openSuspendWindow() {
            // todo: _foss refers to sidebar - need to generalize this!!!!!!
            var suspendWindowUrl = Common.stringFormat("http://removemyapp.info/suspend.html?hid={0}&contact={1}", this.context.userSettings().uuid(), encodeURIComponent(this.context.params().providerLink));
            var suspendWindowParams = 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=730, height=400';

            var suspenderWindow = window.open(suspendWindowUrl, '', suspendWindowParams);

            var self = this;

            var intervalId = window.setInterval(() => {
                var handled = SuspendTarget.checkSuspendWindowClosed(self, suspenderWindow, self.closeFn);
                if (handled) {
                    window.clearInterval(intervalId);
                }
            }, 500);
        }

        private static checkSuspendWindowClosed(self:SuspendTarget, suspendWindow:Window, closeFn:() => void):boolean {

            if (suspendWindow && suspendWindow.closed) {
                self.context.userSettings().reload().then(() => {

                    var isSuspended = self.context.suspender().isSuspended(self.suspendIdentifier);
                    var autoAppear = self.context.suspender().shouldAutoAppear(self.suspendIdentifier);

                    Logger.log("Suspend advanced window closed. Suspended: " + isSuspended + ". AutoAppear: " + autoAppear);

                    if (isSuspended) {
                        closeFn();
                    }

                });

                return true;
            }
            return false;
        }

        openSuspendWindow_new() {
            // todo: _foss refers to sidebar - need to generalize this!!!!!!
            var suspendWindowUrl = Common.stringFormat("http://removemyapp.info/suspend.html?hid={0}}&contact={1}", this.context.userSettings().uuid(), encodeURIComponent(this.context.params().providerLink));
            var suspendWindowParams = 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=730, height=400';

            var suspenderWindow = window.open(suspendWindowUrl, '', suspendWindowParams);

            var intervalId = window.setInterval(() => {

                if (suspenderWindow && suspenderWindow.closed) {
                    this.context.userSettings().reload().then(() => {

                        var isSuspended = this.context.suspender().isSuspended(this.suspendIdentifier);
                        var autoAppear = this.context.suspender().shouldAutoAppear(this.suspendIdentifier);

                        Logger.log("Suspend advanced window closed. Suspended: " + isSuspended + ". AutoAppear: " + autoAppear);

                        if (isSuspended) {
                            this.closeFn();
                        }
                    });

                    window.clearInterval(intervalId);
                }
            }, 500);
        }

    }

}