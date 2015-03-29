/// <reference path="IStore.ts" />

module BD.APP.Common {

    export class GlobalSpace implements IStore{

        private datastore:{[index: string]: any} = null;

        constructor(section?: string) {
            if (!window["BD"]["GlobalStore"]) {
                window["BD"]["GlobalStore"] = {};
            }
            this.datastore = window["BD"]["GlobalStore"];

            if (section) {
                if (!(section in this.datastore)) {
                    this.datastore[section] = {};
                }
                this.datastore = this.datastore[section];
            }
        }

        retrive<T>(key: string): T {
            return this.datastore[key];
        }

        store(key: string, value: any) {
            this.datastore[key] = value;
        }

        remove(key:string) {
            delete this.datastore[key];
        }


        retriveAndRemove<T>(key: string): T {
            var value:T = this.retrive<T>(key);
            this.remove(key);
            return value;
        }

    }
}