
module KCW.API {
    export class Routes {
        private routes: Object = {
            "/api/subscribe": new RegExp("/api/(subscribe)(/?.*)")
        };
        match(req: IApiRequest): Controller {
            if (! this.routes[req.path]) return new NotFoundController(req);
            var match = this.routes[req.path].exec(req.path);
            var controllerName = $.map(match[1].split("/"), (word: string) => {
                return word[0].toUpperCase() + word.slice(1);
            }).join("");
            var controller = KCW.API[controllerName + "Controller"];
            if (controller) return new KCW.API[controllerName + "Controller"](req);
            return new NotFoundController(req);
        }
    }
}