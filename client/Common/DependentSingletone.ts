module BD.APP.Common {

    export class DependentSingletone<T> {

        private keyFunc:() => any;
        private valueFunc:() => T;

        private virgin:boolean;
        private key:any;
        private _value:T;

        constructor(keyFunc:() => any, valueFunc:() => T) {
            this.virgin = true;
            this.keyFunc = keyFunc;
            this.valueFunc = valueFunc;
        }

        value():T {
            var currentKey = this.keyFunc();

            if (this.virgin || currentKey != this.key) {
                this._value = this.valueFunc();
                this.key = currentKey;
                this.virgin = false;
            }

            return this._value;
        }
    }
}
