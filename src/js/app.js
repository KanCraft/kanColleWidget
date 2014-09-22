var KCW;
(function (KCW) {
    KCW.EventKind = {
        NyukoFinish: "nyukyo-finish",
        MissionFinish: "mission-finish",
        CreateshipFinish: "createship-finish",
        SortieFinish: "sortie-finish"
    };

    var EventModel = (function () {
        function EventModel(kind, finish, prefix, identifier, suffix, label, fulltext) {
            this.kind = kind;
            this.finish = finish;
            this.prefix = prefix;
            this.identifier = identifier;
            this.suffix = suffix;
            this.label = label;
            this.fulltext = fulltext;
        }
        EventModel.createWithParams = function (params) {
            return new this(params.kind, params.finish, params.prefix, params.primaryId, params.suffix, params.label, params.fulltext);
        };

        EventModel.prototype.getFullMessageText = function () {
            return this.fulltext || this.createMessageText();
        };
        EventModel.prototype.createMessageText = function () {
            return this.createMessageHeader() + this.prefix + this.identifier + this.suffix + this.createMessageFooter();
        };

        EventModel.prototype.createMessageHeader = function () {
            return "";
        };

        EventModel.prototype.createMessageFooter = function () {
            return "";
        };
        return EventModel;
    })();
    KCW.EventModel = EventModel;
})(KCW || (KCW = {}));
var KCW;
(function (KCW) {
    var Badge = (function () {
        function Badge(params) {
            if (typeof params === "undefined") { params = {}; }
            this.text = "";
            this.color = "#0FABB1";
            if (params.text)
                this.text = params.text;
            if (params.color)
                this.color = params.color;
        }
        Badge.prototype.setText = function (text) {
            this.text = text;
        };
        Badge.prototype.setColor = function (colorCode) {
            this.color = colorCode;
        };
        Badge.prototype.show = function () {
            this.update();
        };
        Badge.prototype.clear = function () {
            this.text = "";
            this.color = "";
            this.update();
        };
        Badge.prototype.update = function () {
            this.updateColor();
            this.updateText();
        };
        Badge.prototype.updateText = function () {
            chrome.browserAction.setBadgeText({ text: this.text });
        };
        Badge.prototype.updateColor = function () {
            chrome.browserAction.setBadgeBackgroundColor({ color: this.color });
        };
        return Badge;
    })();
    KCW.Badge = Badge;
})(KCW || (KCW = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var KCW;
(function (KCW) {
    var ObsoleteBadgeManager = (function (_super) {
        __extends(ObsoleteBadgeManager, _super);
        function ObsoleteBadgeManager(event) {
            _super.call(this);
            this.dispatch(event);
        }
        ObsoleteBadgeManager.prototype.show = function () {
            _super.prototype.show.call(this);
        };
        ObsoleteBadgeManager.prototype.dispatch = function (event) {
            this.text = this.getText(event.finish);
            this.color = this.getColor(event.kind);
        };
        ObsoleteBadgeManager.prototype.getColor = function (kind) {
            switch (kind) {
                case KCW.EventKind.MissionFinish:
                    return "#0fabb1";
                case KCW.EventKind.NyukoFinish:
                    return "#5b84ff";
                case KCW.EventKind.CreateshipFinish:
                    return "#ff8e1b";
                case KCW.EventKind.SortieFinish:
                    return "#d0d0d0";
                default:
                    return "#0fabb1";
            }
        };
        ObsoleteBadgeManager.prototype.getText = function (finish) {
            var diffMilliSec = finish - (new Date()).getTime();
            var sec = Math.floor(diffMilliSec / 1000);
            if (sec < 60) {
                return "0";
            }
            var min = Math.floor(sec / 60);
            if (min < 60) {
                return String(min) + 'm';
            }
            var hour = Math.floor(min / 60);
            return String(hour) + 'h' + '+';
        };
        return ObsoleteBadgeManager;
    })(KCW.Badge);
    KCW.ObsoleteBadgeManager = ObsoleteBadgeManager;
})(KCW || (KCW = {}));
var KCW;
(function (KCW) {
    var Server = (function () {
        function Server(serverURL) {
            this.serverURL = serverURL;
        }
        Server.prototype.post = function (path, data) {
            if (typeof data === "undefined") { data = {}; }
            return this._send("POST", path, data);
        };
        Server.prototype._send = function (method, path, data) {
            if (typeof data === "undefined") { data = {}; }
            var deferred = $.Deferred();
            $.ajax({
                url: this.serverURL + path,
                type: method,
                data: data,
                success: function (res) {
                    deferred.resolve(res);
                },
                error: function (err) {
                    deferred.reject(err);
                }
            });
            return deferred.promise();
        };
        return Server;
    })();
    KCW.Server = Server;
})(KCW || (KCW = {}));
var KCW;
(function (KCW) {
    var ServicePush = (function (_super) {
        __extends(ServicePush, _super);
        function ServicePush() {
            _super.call(this, "http://push-kcwidget.oti10.com");
        }
        ServicePush.prototype.enqueueEvent = function (event) {
            var _this = this;
            var deferred = $.Deferred();
            if (!Config.get('twitter-id-str')) {
                this.showAlert('Push通知を使う場合はTwitter認証しなおしてくだしあ');
                return deferred.reject();
            }
            var params = this.makeEnqueueParamsFromEvent(event);
            var promise = this.post("/queue/add", params);
            promise.done(function (res) {
                if (res['code'] != 1000) {
                    _this.showAlert("code:" + res['code'] + "\nmessage:" + res['message']);
                    deferred.reject(res);
                } else {
                    deferred.resolve(res);
                }
            });
            promise.fail(function (err) {
                _this.showAlert(JSON.stringify(err));
                deferred.reject(err);
            });
            return deferred.promise();
        };
        ServicePush.prototype.showAlert = function (message) {
            var header = "[ERROR:ServicePushKCWidget]\n";
            window.alert(header + message);
        };
        ServicePush.prototype.makeEnqueueParamsFromEvent = function (event) {
            var params = {};
            params.kind = event.kind;
            if (event.kind != "createship-finish") {
                params.finish = event.finish - parseInt(Config.get("notification-offset-millisec"));
            } else {
                params.finish = event.finish;
            }
            params.finish = Math.floor(params.finish / 1000);
            params.clientToken = KanColleWidget.PushServerConfig.client_token;
            params.id_str = Config.get('twitter-id-str');
            params.message = event.toMessage();
            params.label = event.label;
            params.prefix = event.prefix;
            params.identifier = event.primaryId;
            params.unit = event.unit;
            params.kind = event.kind;
            params.missionTitle = (event.info) ? event.info.MissionTitle : "";
            params.missionId = (event.info) ? event.info.MissionId : "";
            return params;
        };
        return ServicePush;
    })(KCW.Server);
    KCW.ServicePush = ServicePush;
})(KCW || (KCW = {}));
