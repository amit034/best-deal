
module BD.APP.Common {

    export interface ISuspender {
        isSuspended(suspendIdentifier:string):boolean;
        suspend(suspendIdentifier:string, ms:number);
        shouldAutoAppear(suspendIdentifier:string):boolean;
    }
}
