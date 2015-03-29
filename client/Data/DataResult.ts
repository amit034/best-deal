
/// <reference path="../Context/LVContext" />
/// <reference path="../Common/Promise" />



module BD.APP.Data {




    export interface DataResultSet {
        [key: string]: DataResult;
    }


    export interface DataResult {
        source:string;
        context: Context.LVContext;

        hasData():boolean;
        extras?:{[index:string]: any}
    }

    export interface DataGenerator<T,R> extends DataResult {
        generateData(param:T, context:Context.LVContext, count:number):Common.Promise<R>;
    }




    export class PlainDataResult<R> implements DataResult{

        source:string;
        context: Context.LVContext;
        extras:{[index:string]: any};
        data:R[];

        constructor(source:string, context:Context.LVContext, data:R[], extras:{[index:string]: any} = {}) {
            this.source = source;
            this.context = context;
            this.data = data;
            this.extras = extras;
        }

        hasData():boolean {
            return this.data && this.data.length > 0;
        }
    }

    export class StubDataResult implements DataResult {

        source:string;
        context: Context.LVContext;

        constructor(source:string, context:Context.LVContext) {
            this.source = source;
            this.context = context;
        }

        hasData():boolean {
            return true;
        }

    }


    export class DataGeneratorResult<T, R> extends StubDataResult implements DataGenerator<T, R>{

        private generator:(param:T, context:Context.LVContext, counts:number) => Common.Promise<R>;

        constructor(source:string,  context:Context.LVContext, generator:(param:T, context:Context.LVContext, counts:number) => Common.Promise<R>) {
            super(source, context);

            this.generator = generator;
        }

        generateData(param:T, context:Context.LVContext, counts:number):Common.Promise<R> {
            return this.generator(param, context, counts);
        }

    }


}
