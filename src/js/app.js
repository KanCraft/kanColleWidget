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
    var Repository = (function () {
        function Repository(impl, name, mapper, prefix) {
            if (typeof prefix === "undefined") { prefix = ""; }
            this.impl = impl;
            this.name = name;
            this.mapper = mapper;
            this.prefix = prefix;
        }
        Repository.prototype.defaultValue = function () {
            return null;
        };
        Repository.prototype.key = function () {
            return this.prefix + this.name;
        };
        Repository.prototype.get = function () {
            var stored = this.impl.getItem(this.key());
            if (stored == null)
                return this.defaultValue();
            return this.mapper.decode(stored);
        };
        Repository.prototype.set = function (val) {
            this.impl.setItem(this.key(), this.mapper.encode(val));
        };
        Repository.prototype.restore = function () {
            return $.extend(this.defaultValue(), this.get());
        };
        return Repository;
    })();
    KCW.Repository = Repository;
})(KCW || (KCW = {}));
var KCW;
(function (KCW) {
    var WindowBlank = (function () {
        function WindowBlank(offsetLeft, offsetTop, width, height) {
            this.offsetLeft = offsetLeft;
            this.offsetTop = offsetTop;
            this.width = width;
            this.height = height;
        }
        WindowBlank.calculate = function (wholeWidth, wholeHeight) {
            var screen = { width: wholeWidth, height: wholeHeight };
            var aspect = 0.6;
            var blank = {
                offsetTop: 0,
                offsetLeft: 0,
                height: 0,
                width: 0
            };
            if (screen.height / screen.width < aspect) {
                blank.width = screen.width - (screen.height / aspect);
                blank.offsetLeft = blank.width / 2;
            } else {
                blank.height = screen.height - (screen.width * aspect);
                blank.offsetTop = blank.height / 2;
            }
            return new WindowBlank(blank.offsetLeft, blank.offsetTop, blank.width, blank.height);
        };
        return WindowBlank;
    })();
    KCW.WindowBlank = WindowBlank;
})(KCW || (KCW = {}));
var KCW;
(function (KCW) {
    (function (Infra) {
        function detectWindow(exps) {
            var found = false;
            var d = $.Deferred();
            chrome.windows.getAll({ populate: true }, function (wins) {
                for (var i = 0; i < wins.length; i++) {
                    var win = wins[i];
                    if (!win.tabs || win.tabs.length == 0)
                        continue;
                    if (Infra.strings(win.tabs[0].url).hit(exps))
                        return d.resolve(win);
                }
                return d.reject();
            });
            return d.promise();
        }
        Infra.detectWindow = detectWindow;
    })(KCW.Infra || (KCW.Infra = {}));
    var Infra = KCW.Infra;
})(KCW || (KCW = {}));
var KCW;
(function (KCW) {
    var WindowFinder = (function () {
        function WindowFinder() {
        }
        WindowFinder.findKCWidget = function () {
            return KCW.Infra.detectWindow([WindowFinder.kcwExp, WindowFinder.dmmExp]);
        };
        WindowFinder.kcwExp = /^http:\/\/osapi.dmm.com\/gadgets\/ifr/;
        WindowFinder.dmmExp = /^http:\/\/www.dmm.com\/.+\/app_id=854854/;
        return WindowFinder;
    })();
    KCW.WindowFinder = WindowFinder;
})(KCW || (KCW = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var KCW;
(function (KCW) {
    var ShipsStatusMapper = (function () {
        function ShipsStatusMapper() {
        }
        ShipsStatusMapper.prototype.encode = function (p) {
            return JSON.stringify(p);
        };
        ShipsStatusMapper.prototype.decode = function (stored) {
            var obj = JSON.parse(stored);
            return {
                coords: { left: obj["coords"]["left"], top: obj["coords"]["top"] },
                size: { width: obj["size"]["width"], height: obj["size"]["height"] }
            };
        };
        return ShipsStatusMapper;
    })();

    var ShipsStatusWindowRepository = (function (_super) {
        __extends(ShipsStatusWindowRepository, _super);
        function ShipsStatusWindowRepository(impl) {
            _super.call(this, impl, "tracking.statusWindow", new ShipsStatusMapper());
        }
        ShipsStatusWindowRepository.local = function () {
            return new this(window.localStorage);
        };
        ShipsStatusWindowRepository.prototype.defaultValue = function () {
            return {
                coords: {
                    left: 50,
                    top: 50
                },
                size: {
                    width: 132,
                    height: 215
                }
            };
        };
        return ShipsStatusWindowRepository;
    })(KCW.Repository);
    KCW.ShipsStatusWindowRepository = ShipsStatusWindowRepository;
})(KCW || (KCW = {}));
var KCW;
(function (KCW) {
    (function (Infra) {
        (function (URL) {
            var Builder = (function () {
                function Builder(delim, prefix, joint) {
                    if (typeof delim === "undefined") { delim = "&"; }
                    if (typeof prefix === "undefined") { prefix = "?"; }
                    if (typeof joint === "undefined") { joint = "="; }
                    this.delim = delim;
                    this.prefix = prefix;
                    this.joint = joint;
                }
                Builder.prototype.encode = function (params) {
                    var pool = [];
                    for (var key in params) {
                        pool.push([String(key), encodeURIComponent(params[key])].join(this.joint));
                    }
                    return this.prefix + pool.join(this.delim);
                };

                Builder.prototype.decode = function (query, def) {
                    if (typeof def === "undefined") { def = {}; }
                    var _this = this;
                    var t = {};
                    $.each(query.replace(this.prefix, "").split(this.delim), function (i, keyVal) {
                        var kv = keyVal.split(_this.joint);
                        if (kv.length < 2)
                            return;
                        t[kv[0]] = kv[1];
                    });
                    return $.extend({}, t, def);
                };
                return Builder;
            })();
            URL.Builder = Builder;
        })(Infra.URL || (Infra.URL = {}));
        var URL = Infra.URL;
    })(KCW.Infra || (KCW.Infra = {}));
    var Infra = KCW.Infra;
})(KCW || (KCW = {}));
var KCW;
(function (KCW) {
    (function (Infra) {
        var WindowFrame = (function () {
            function WindowFrame(url, target, position, size, options) {
                if (typeof options === "undefined") { options = {}; }
                this.url = url;
                this.target = target;
                this.position = position;
                this.size = size;
                this.options = options;
            }
            WindowFrame.prototype.open = function () {
                return window.open(this.url, this.target, this.encodeQuery());
            };
            WindowFrame.prototype.encodeQuery = function () {
                return [
                    this.position.encodeQuery(),
                    this.size.encodeQuery()
                ].join(",");
            };

            WindowFrame.create = function (params) {
                return new WindowFrame(params.url, params.target || "_blank", new WindowPosition(params.left, params.top), new WindowSize(params.width, params.height), params.option);
            };
            return WindowFrame;
        })();
        Infra.WindowFrame = WindowFrame;
        var WindowPosition = (function () {
            function WindowPosition(left, top, builder) {
                if (typeof builder === "undefined") { builder = new Infra.URL.Builder(",", ""); }
                this.left = left;
                this.top = top;
                this.builder = builder;
            }
            WindowPosition.prototype.encodeQuery = function () {
                return this.builder.encode({
                    left: this.left,
                    top: this.top
                });
            };
            return WindowPosition;
        })();
        Infra.WindowPosition = WindowPosition;
        var WindowSize = (function () {
            function WindowSize(width, height, builder) {
                if (typeof builder === "undefined") { builder = new Infra.URL.Builder(",", ""); }
                this.width = width;
                this.height = height;
                this.builder = builder;
            }
            WindowSize.prototype.encodeQuery = function () {
                return this.builder.encode({
                    width: this.width,
                    height: this.height
                });
            };
            return WindowSize;
        })();
        Infra.WindowSize = WindowSize;
    })(KCW.Infra || (KCW.Infra = {}));
    var Infra = KCW.Infra;
})(KCW || (KCW = {}));
var KCW;
(function (KCW) {
    (function (Infra) {
        var Capture = (function () {
            function Capture() {
            }
            Capture.whole = function (windowId) {
                if (typeof windowId === "undefined") { windowId = null; }
                var d = $.Deferred();
                chrome.tabs.captureVisibleTab(windowId, Capture.getOptions(), function (imgURI) {
                    d.resolve(imgURI);
                });
                return d.promise();
            };
            Capture.getOptions = function () {
                return {
                    format: "png"
                };
            };
            return Capture;
        })();
        Infra.Capture = Capture;
    })(KCW.Infra || (KCW.Infra = {}));
    var Infra = KCW.Infra;
})(KCW || (KCW = {}));
var KCW;
(function (KCW) {
    (function (Infra) {
        var ImageTrimmer = (function () {
            function ImageTrimmer(imgURI) {
                this.imgURI = imgURI;
            }
            ImageTrimmer.prototype.trim = function (coords, size, opt) {
                if (typeof opt === "undefined") { opt = { format: 'jpeg' }; }
                var img = new Image();
                img.src = this.imgURI;

                var canvas = document.createElement('canvas');
                canvas.id = 'canvas';
                canvas.width = size.width;
                canvas.height = size.height;
                var ctx = canvas.getContext('2d');

                ctx.drawImage(img, coords.left, coords.top, size.width, size.height, 0, 0, canvas.width, canvas.height);

                return canvas.toDataURL('image/' + opt.format);
            };
            return ImageTrimmer;
        })();
        Infra.ImageTrimmer = ImageTrimmer;
    })(KCW.Infra || (KCW.Infra = {}));
    var Infra = KCW.Infra;
})(KCW || (KCW = {}));
var KCW;
(function (KCW) {
    var ShipsStatusWindow = (function (_super) {
        __extends(ShipsStatusWindow, _super);
        function ShipsStatusWindow(params, imgURI) {
            _super.call(this, ShipsStatusWindow.url() + "?imgURI=" + imgURI, "_blank", new KCW.Infra.WindowPosition(params.coords.left, params.coords.top), new KCW.Infra.WindowSize(params.size.width, params.size.height));
        }
        ShipsStatusWindow.show = function () {
            var _this = this;
            var d = $.Deferred();
            KCW.WindowFinder.findKCWidget().done(function (win) {
                KCW.Infra.Capture.whole(win.id).done(function (imgURI) {
                    imgURI = ShipsStatusWindow.trim(imgURI);
                    var params = KCW.ShipsStatusWindowRepository.local().restore();
                    var win = new _this(params, imgURI);
                    win.instance = win.open();
                    win.register();
                });
            });
            return d.promise();
        };
        ShipsStatusWindow.prototype.register = function () {
            ShipsStatusWindow.created.push(this);
        };
        ShipsStatusWindow.prototype.close = function () {
            if (this.instance && this.instance.close)
                this.instance.close();
        };
        ShipsStatusWindow.sweep = function () {
            for (var i = 0; i < ShipsStatusWindow.created.length; i++) {
                ShipsStatusWindow.created[i].close();
            }
            ShipsStatusWindow.created = [];
        };
        ShipsStatusWindow.trim = function (imgURI) {
            var params = ShipsStatusWindow.calcOpenParams(imgURI);
            return new KCW.Infra.ImageTrimmer(imgURI).trim(params.coords, params.size);
        };
        ShipsStatusWindow.calcOpenParams = function (imgURI) {
            var img = new Image();
            img.src = imgURI;
            var blank = KCW.WindowBlank.calculate(img.width, img.height);
            return {
                coords: {
                    left: (img.width - blank.width) * (141 / 500) + blank.offsetLeft,
                    top: (img.height - blank.height) * (3 / 8) + blank.offsetTop
                },
                size: {
                    width: (img.width - blank.width) * (43 / 200),
                    height: (img.height - blank.height) * (7 / 12)
                }
            };
        };
        ShipsStatusWindow.url = function () {
            return chrome.extension.getURL('/') + 'src/html/ships_status.html';
        };
        ShipsStatusWindow.created = [];
        return ShipsStatusWindow;
    })(KCW.Infra.WindowFrame);
    KCW.ShipsStatusWindow = ShipsStatusWindow;
})(KCW || (KCW = {}));
var KCW;
(function (KCW) {
    var Badge = (function () {
        function Badge(params) {
            if (typeof params === "undefined") { params = {}; }
            var _this = this;
            this.text = "";
            this.color = "#0FABB1";
            if (params.text) {
                this.text = params.text;
            } else {
                this.getCurrentText().done(function (text) {
                    _this.text = text;
                });
            }
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
        Badge.prototype.incrementByCount = function (count) {
            var current = parseInt(this.text) || 0;
            if (current + count)
                this.text = String(current + count); else
                this.text = "";
            this.update();
        };
        Badge.prototype.updateText = function () {
            chrome.browserAction.setBadgeText({ text: this.text });
        };
        Badge.prototype.updateColor = function () {
            chrome.browserAction.setBadgeBackgroundColor({ color: this.color });
        };
        Badge.prototype.getCurrentText = function () {
            var d = $.Deferred();
            chrome.browserAction.getBadgeText({}, function (val) {
                d.resolve(val);
            });
            return d.promise();
        };
        return Badge;
    })();
    KCW.Badge = Badge;
})(KCW || (KCW = {}));
var KCW;
(function (KCW) {
    var ObsoleteBadgeManager = (function (_super) {
        __extends(ObsoleteBadgeManager, _super);
        function ObsoleteBadgeManager(event) {
            if (typeof event === "undefined") { event = null; }
            _super.call(this);
            if (event)
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
    (function (Infra) {
        function strings(str) {
            return new Strings(str);
        }
        Infra.strings = strings;
        var Strings = (function () {
            function Strings(val) {
                this.val = String(val);
            }
            Strings.prototype.hit = function (exps) {
                for (var i = 0; i < exps.length; i++) {
                    if (exps[i].test(this.val))
                        return true;
                }
                return false;
            };
            Strings.prototype.satisfy = function (exps) {
                for (var i = 0; i < exps.length; i++) {
                    if (!exps[i].test(this.val))
                        return false;
                }
                return true;
            };
            return Strings;
        })();
        Infra.Strings = Strings;
    })(KCW.Infra || (KCW.Infra = {}));
    var Infra = KCW.Infra;
})(KCW || (KCW = {}));
