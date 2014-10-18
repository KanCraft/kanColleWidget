/// <reference path="../../../definitions/jquery.d.ts" />
/// <reference path="../../../definitions/chrome.d.ts" />

module KCW.API {
    export interface IApiRequest {
        path: string;
        params: any;
        sender?: chrome.runtime.MessageSender;
    }
    export interface IApiResponse {
        status: number;
        message: string;
        body?: any;
    }
    export class Router {
        private routes: Routes;
        private static instance: Router = null;
        constructor(routes: Routes = null) {
            if (routes == null) routes = new Routes();
            this.routes = routes;
        }
        public static listen() {
            if (Router.instance != null) return;
            Router.instance = new this();
            chrome.runtime.onMessageExternal.addListener(Router.instance.onMessage);
        }
        private onMessage(req: IApiRequest, sender: chrome.runtime.MessageSender, sendRes: (IApiResponse) => any) {
            req.sender = sender;
            Router.instance.resolve(req).done(controller => {
                controller.prepare().perform().finish().done((res: IApiResponse) => {
                    sendRes(res);
                }).fail((err: IApiResponse) => {
                    sendRes(err);
                });
            });
        }
        private resolve(req: IApiRequest): JQueryPromise<Controller> {
            var d = $.Deferred();
            var controller = this.resolveController(req);
            d.resolve(controller);
            return d;
        }
        private resolveController(req: IApiRequest): Controller {
            return this.routes.match(req);
        }
    }
}