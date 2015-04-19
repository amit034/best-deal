/// <reference path="../External/jquery"/>

module BD.APP.Common {

    export class CollisionHelper {

        private static antiCollisionClass:string = "bd-close-xyz sgsefvhuedc";

        static treatForCollisions(rootElement:JQuery):void {
            rootElement.addClass(CollisionHelper.antiCollisionClass);
            rootElement.find("*").addClass(CollisionHelper.antiCollisionClass);
        }

    }

}
