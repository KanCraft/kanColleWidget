/// <reference path="../definitions/chrome/chrome.d.ts" />
/// <reference path="../definitions/jquery/jquery.d.ts" />
/// <reference path="./controllers/controller.ts" />
/// <reference path="./controllers/not-found-controller.ts" />
/// <reference path="./controllers/subscribe-controller.ts" />
/// <reference path="./controllers/unsubscribe-controller.ts" />

module API {
    export function Serve() {
        var router = new Router();
        var listener = (message: IRequestMessage, sender: chrome.runtime.MessageSender, sendResponse: (any) => any) => {
            router
            .match(message, sender)
            .execute()
            .done((response: Response) => {
                sendResponse({status: 200, response: response, request: message});
            })
            .fail((error: Err) => {
                sendResponse({status: error.code, error: error, request: message});
            });
        };
        chrome.runtime.onMessageExternal.addListener(listener);
    }

    export class Router {
        private routes = {
            "not_found": NotFoundController,
            "/api/subscribe": SubscribeController,
            "/api/unsubscribe": UnsubscribeController
        };
        match(req: IRequestMessage, sender: chrome.runtime.MessageSender): Controller {
            if (! req.path || ! this.routes[req.path]) return new this.routes["not_found"](req, sender);
            return new this.routes[req.path](req, sender);
        }
    }
}
// To start API, jsut call
// API.Serve();
