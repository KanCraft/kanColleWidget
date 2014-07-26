var API;
(function (API) {
    var Response = (function () {
        function Response(message) {
            if (typeof message === "undefined") { message = ""; }
            this.message = message;
        }
        return Response;
    })();
    API.Response = Response;
})(API || (API = {}));
var debug = function (marker, value) {
    console.log("[kcw]", marker, value);
};
var API;
(function (API) {
    API.INTERNAL = 500;
    API.ACCESS_DENIED = 403;
    API.ENDPOINT_NOT_FOUND = 404;
    API.ALREADY_SUBSCRIBED = 409;
    var Err = (function () {
        function Err(code) {
            this.code = code;
            this.message = Err.getMessage(code);
        }
        Err.getMessage = function (code) {
            return Err.messages[String(code)] || "Unknown error";
        };
        Err.Of = function (code) {
            return new this(code);
        };
        Err.messages = {
            "403": "Access denied by user",
            "404": "Endpoint not found",
            "409": "Already registered subscriber",
            "500": "Chrome Extension Internal Error"
        };
        return Err;
    })();
    API.Err = Err;
})(API || (API = {}));
var API;
(function (API) {
    var Controller = (function () {
        function Controller(req, sender) {
            this.req = req;
            this.sender = sender;
            this.deferred = $.Deferred();
        }
        Controller.prototype.execute = function () {
            return this.deferred.resolve("Each controller should implement `execute`");
        };
        Controller.prototype.reject = function (err) {
            return this.deferred.reject(err);
        };
        Controller.prototype.resolve = function (res) {
            return this.deferred.resolve(res);
        };
        return Controller;
    })();
    API.Controller = Controller;
})(API || (API = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var API;
(function (API) {
    var NotFoundController = (function (_super) {
        __extends(NotFoundController, _super);
        function NotFoundController() {
            _super.apply(this, arguments);
        }
        NotFoundController.prototype.execute = function () {
            return this.reject(API.Err.Of(API.ENDPOINT_NOT_FOUND));
        };
        return NotFoundController;
    })(API.Controller);
    API.NotFoundController = NotFoundController;
})(API || (API = {}));
var API;
(function (API) {
    var Subscriber = (function () {
        function Subscriber(extId) {
            this.extId = extId;
        }
        Subscriber.prototype.getId = function () {
            return this.extId;
        };
        Subscriber.prototype.toJSON = function () {
            return {
                extId: this.extId
            };
        };
        return Subscriber;
    })();
    API.Subscriber = Subscriber;
})(API || (API = {}));
var API;
(function (API) {
    var RepositoryBase = (function () {
        function RepositoryBase(name) {
            this.storage = window.localStorage || window.sessionStorage;
            this.key = "KanColleWidget.API." + name;
        }
        RepositoryBase.prototype._save = function (value) {
            var valueString = "";
            try  {
                valueString = JSON.stringify(value);
                this.storage.setItem(this.key, valueString);
                return true;
            } catch (e) {
                debug(this.key, e);
                return false;
            }
        };
        RepositoryBase.prototype._get = function () {
            try  {
                var valuString = this.storage.getItem(this.key);
                if (!valuString)
                    return {};
                return JSON.parse(valuString);
            } catch (e) {
                debug(this.key, e);
                return {};
            }
        };
        return RepositoryBase;
    })();
    API.RepositoryBase = RepositoryBase;
})(API || (API = {}));
var API;
(function (API) {
    var SubscriberRepository = (function (_super) {
        __extends(SubscriberRepository, _super);
        function SubscriberRepository() {
            _super.call(this, "subscriber");
        }
        SubscriberRepository.prototype.findAll = function () {
            var all = [];
            var saved = this._get();
            for (var i in saved) {
                if (saved[i]["extId"])
                    all.push(new API.Subscriber(saved[i]['extId']));
            }
            return all;
        };
        SubscriberRepository.prototype.add = function (subscriber) {
            var saved = this._get();
            saved[subscriber.getId()] = subscriber.toJSON();
            return this._save(saved);
        };
        SubscriberRepository.prototype.alreadyHave = function (subscriber) {
            if (this._get()[subscriber.getId()])
                return true;
            return false;
        };
        return SubscriberRepository;
    })(API.RepositoryBase);
    API.SubscriberRepository = SubscriberRepository;
})(API || (API = {}));
var API;
(function (API) {
    var SubscribeController = (function (_super) {
        __extends(SubscribeController, _super);
        function SubscribeController() {
            _super.apply(this, arguments);
        }
        SubscribeController.prototype.execute = function () {
            if (!this.confirm())
                return this.reject(API.Err.Of(API.ACCESS_DENIED));
            var subscriber = new API.Subscriber(this.sender.id);
            var repo = new API.SubscriberRepository();
            if (repo.alreadyHave(subscriber))
                return this.reject(API.Err.Of(API.ALREADY_SUBSCRIBED));
            if (!repo.add(subscriber))
                return this.reject(API.Err.Of(API.INTERNAL));
            return this.succeeded();
        };
        SubscribeController.prototype.confirm = function () {
            var message = "https://chrome.google.com/webstore/detail/";
            message += String(this.sender.id) + "\n";
            message += "が艦これウィジェットのデータを要求しています.\n";
            message += "許可するっぽい？";
            return window.confirm(message);
        };
        SubscribeController.prototype.succeeded = function () {
            return this.resolve(new API.Response("Subscriber accepted"));
        };
        return SubscribeController;
    })(API.Controller);
    API.SubscribeController = SubscribeController;
})(API || (API = {}));
var API;
(function (API) {
    function Serve() {
        var router = new Router();
        var listener = function (message, sender, sendResponse) {
            router.match(message, sender).execute().done(function (response) {
                sendResponse({ status: 200, response: response, request: message });
            }).fail(function (error) {
                sendResponse({ status: error.code, error: error, request: message });
            });
        };
        chrome.runtime.onMessageExternal.addListener(listener);
    }
    API.Serve = Serve;

    var Router = (function () {
        function Router() {
            this.routes = {
                "not_found": API.NotFoundController,
                "/api/subscribe": API.SubscribeController
            };
        }
        Router.prototype.match = function (req, sender) {
            if (!req.path || !this.routes[req.path])
                return new this.routes["not_found"](req, sender);
            return new this.routes[req.path](req, sender);
        };
        return Router;
    })();
    API.Router = Router;
})(API || (API = {}));

API.Serve();
