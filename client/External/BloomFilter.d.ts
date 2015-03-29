// https://github.com/jasondavies/bloomfilter.js
declare module BD {

    export class BloomFilter {
        constructor(items:number[], hashFunctionNum:number);

        //constructor(bitNum:number, hashFunctionNum:number);

        add(item:string): void;
        test(item:string): boolean;
    }

}
