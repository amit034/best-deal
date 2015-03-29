/// <reference path="../External/jquery"/>
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Common;
        (function (Common) {
            var CollisionHelper = (function () {
                function CollisionHelper() {
                }
                CollisionHelper.treatForCollisions = function (rootElement) {
                    rootElement.addClass(CollisionHelper.antiCollisionClass);
                    rootElement.find("*").addClass(CollisionHelper.antiCollisionClass);
                };
                CollisionHelper.antiCollisionClass = "fo-close-xyz sgsefvhuedc";
                return CollisionHelper;
            })();
            Common.CollisionHelper = CollisionHelper;
        })(Common = APP.Common || (APP.Common = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
