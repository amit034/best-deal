
module BD.APP.Model {

    export class HoverTarget {

        hoverStartTime:number;
        minHoverMS:number;
        maxHoverMS:number;
        onHoverDone:(ms:number) => void;

        constructor(minHoverMS:number, maxHoverMS:number, onHoverDone:(ms:number) => void) {

            this.minHoverMS = minHoverMS;
            this.maxHoverMS = maxHoverMS;
            this.onHoverDone = onHoverDone;
        }

        hoverStart(self:HoverTarget, dataContext, event:MouseEvent):void {
            if (self.hoverStartTime == null) {
                self.hoverStartTime = new Date().getTime();
            }
        }

        hoverEnd(self:HoverTarget, dataContext, event:MouseEvent):void {

            // Prevent hover end if moved to child element.
            if ($(event.toElement).closest(event.currentTarget).length > 0) {
                //console.log("moved to child");
                return;
            }


            if (self.hoverStartTime != null) {
                var duration = new Date().getTime() - self.hoverStartTime;
                if (duration > self.minHoverMS && duration < self.maxHoverMS) {
                    self.onHoverDone(duration);
                }

                //console.log("Hover end after " + duration);
            }
            self.hoverStartTime = null;
        }

    }

}
