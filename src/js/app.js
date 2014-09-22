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
                    return "#ffae1f";
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
