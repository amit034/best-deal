var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Model;
        (function (Model) {
            var HoverTarget = (function () {
                function HoverTarget(minHoverMS, maxHoverMS, onHoverDone) {
                    this.minHoverMS = minHoverMS;
                    this.maxHoverMS = maxHoverMS;
                    this.onHoverDone = onHoverDone;
                }
                HoverTarget.prototype.hoverStart = function (self, dataContext, event) {
                    if (self.hoverStartTime == null) {
                        self.hoverStartTime = new Date().getTime();
                    }
                };
                HoverTarget.prototype.hoverEnd = function (self, dataContext, event) {
                    // Prevent hover end if moved to child element.
                    if (BD.$(event.toElement).closest(event.currentTarget).length > 0) {
                        //console.log("moved to child");
                        return;
                    }
                    if (self.hoverStartTime != null) {
                        var duration = new Date().getTime() - self.hoverStartTime;
                        if (duration > self.minHoverMS && duration < self.maxHoverMS) {
                            self.onHoverDone(duration);
                        }
                    }
                    self.hoverStartTime = null;
                };
                return HoverTarget;
            })();
            Model.HoverTarget = HoverTarget;
        })(Model = APP.Model || (APP.Model = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
