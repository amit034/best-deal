/// <reference path="GlobalSpace" />

module BD.APP.Common {

    export class DataSynchronizer {

        private dataSyncStore:IStore = new GlobalSpace("DataSync");

        private getAll():{[key:string]: string} {
            var dataItems = this.dataSyncStore.retrive<{[key:string]: string}>("DataItems");
            if (!dataItems) dataItems = {};

            return dataItems;
        }

        private setAll(dataItems:{[key:string]: string}) {
            this.dataSyncStore.store("DataItems", dataItems);
        }

        claim(key:string, mark:string, force:boolean = false):boolean {

            var dataItems = this.getAll();
            var alreadyClaimed = (key in dataItems);

            if (!alreadyClaimed || force) {
                dataItems[key] = mark;
            }

            this.setAll(dataItems);
            return alreadyClaimed;
        }

        cliamWithoutMarking<T>(source:T[], keyFn:(item:T) => string, claimCount:number, except:T[] = []) {

            var selected:T[] = [];
            var exceptKeys = Collection.select(except, keyFn);

            for (var i = 0; i < source.length; i++) {
                if (selected.length >= claimCount) break;

                var item = source[i];
                var key = keyFn(item);

                var exclude =  Collection.contains(exceptKeys, key);
                if (exclude) continue;

                selected.push(item);
            }

            return selected;
        }

        claimUniques<T>(source:T[], keyFn:(item:T) => string, mark:string, claimCount:number, fallbackToUsed:boolean = true, except:T[] = []) {

            var uniqueItems:T[] = [];
            var nonuniqueItems:T[] = [];
            var selected:T[] = [];

            var claimedItems = this.getAll();
            var exceptKeys = Collection.select(except, keyFn);


            for (var i = 0; i < source.length; i++) {
                var item = source[i];
                var key = keyFn(item);

                var exclude = Collection.contains(exceptKeys, key);
                if (exclude) continue;

                if (key in claimedItems) {
                    nonuniqueItems.push(item)
                }
                else {
                    uniqueItems.push(item);
                    claimedItems[key] = mark;

                    if (uniqueItems.length >= claimCount)
                        break;
                }
            }

            this.setAll(claimedItems);

            if (fallbackToUsed) {
                var fallbackItems = this.cliamWithoutMarking(nonuniqueItems, keyFn, claimCount - uniqueItems.length, uniqueItems);
                selected = uniqueItems.concat(fallbackItems);
            }
            else {
                selected = uniqueItems;
            }

            return selected;
        }
    }
}
