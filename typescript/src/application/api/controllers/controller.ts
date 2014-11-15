
module KCW.API {
    export class Controller {
        public d: JQueryDeferred<IApiResponse>;
        public err: any = null;
        constructor(public request: IApiRequest) {
            this.d = $.Deferred();
        }
        public prepare(): Controller {
            return this;
        }
        public perform(): Controller {
            return this.ng({
                status: 500,
                message: "Controller must be implemented by SubClass"
            });
        }
        public finish(): JQueryPromise {
            return this.d.promise();
        }
        public ok(res: IApiResponse): Controller {
            this.d.resolve(res);
            return this;
        }
        public ng(res: IApiResponse): Controller {
            this.d.reject(res);
            return this;
        }
    }
}