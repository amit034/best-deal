

module BD.APP.Context {


    export class AppContext implements IBaseContext {

        private _paths:IPaths;
        private _params:AppParams;
        private _host:string;

        paths():IPaths { return this._paths; }
        params():AppParams { return this._params; }
        host():string { return this._host }
        isDebugMode():boolean { return true}

        constructor(paths:IPaths, params:AppParams) {

            this._paths = paths;
            this._params = params;
            this._host = window.location.host;

        }

        notificationParams():{[index:string]: string} {

            var contextParams:{[index:string]: string} = {
                'hn': this.host(),
                'partid': this.params() ? this.params().partnerCode : "",
                'subid': this.params() ? this.params().subId : "",
                'v': "001",
                'fam': 'bd',
                'dmn': this.paths().domain()
            };

            return contextParams;
        }



    }

}