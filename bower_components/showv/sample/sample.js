var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Sample;
(function (Sample) {
    var FooterView = (function (_super) {
        __extends(FooterView, _super);
        function FooterView() {
            _super.call(this);
        }
        FooterView.prototype.render = function () {
            this.$el.append('<h4>This software is released under the MIT License.</h4>');
            return this;
        };
        return FooterView;
    })(showv.View);
    Sample.FooterView = FooterView;
})(Sample || (Sample = {}));
var Sample;
(function (Sample) {
    var HeaderView = (function (_super) {
        __extends(HeaderView, _super);
        function HeaderView() {
            _super.call(this);
        }
        HeaderView.prototype.render = function () {
            this.$el.append('<a href="https://github.com/otiai10/showv"><img style="position: absolute; top: 0; left: 0; border: 0;" src="https://github-camo.global.ssl.fastly.net/567c3a48d796e2fc06ea80409cc9dd82bf714434/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f6c6566745f6461726b626c75655f3132313632312e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_left_darkblue_121621.png"></a>', '<h1>Showv <span>The Simplest View Framework for TypeScript<img src="./showv.jpg"></span></h1>');
            return this;
        };
        return HeaderView;
    })(showv.View);
    Sample.HeaderView = HeaderView;
})(Sample || (Sample = {}));
var Sample;
(function (Sample) {
    var SourcecodeView = (function (_super) {
        __extends(SourcecodeView, _super);
        function SourcecodeView(title, source) {
            _super.call(this);
            this.titlePart = new TitlePart(title);
            this.sourcePart = new SourcePart(source);
        }
        SourcecodeView.prototype.render = function () {
            this.$el.append(this.titlePart.render().$el, this.sourcePart.render().$el);
            return this;
        };
        return SourcecodeView;
    })(showv.View);
    Sample.SourcecodeView = SourcecodeView;
    var SourcePart = (function (_super) {
        __extends(SourcePart, _super);
        function SourcePart(sourcecode) {
            _super.call(this, {
                tagName: 'pre',
                className: 'sourcecode prettyprint'
            });
            this.sourcecode = sourcecode;
            this.$el.append(this.sourcecode);
            return this;
        }
        return SourcePart;
    })(showv.View);
    var TitlePart = (function (_super) {
        __extends(TitlePart, _super);
        function TitlePart(title) {
            _super.call(this, {
                tagName: 'a',
                id: title,
                className: 'code-title linky'
            });
            this.title = title;
            this.$el.append($('<h2>').text(this.title));
            this.$el.attr({
                href: '#' + title
            });
            return this;
        }
        return TitlePart;
    })(showv.View);
})(Sample || (Sample = {}));
var Sample;
(function (Sample) {
    var UsageView = (function (_super) {
        __extends(UsageView, _super);
        function UsageView() {
            _super.call(this, "Usage", "/// &lt;reference path=\"your/path/to/showv.d.ts\" /&gt;\n" + "class YourView extends showv.View {\n" + "    constructor() {\n" + "        super();\n" + "    }\n" + "}");
        }
        UsageView.prototype.render = function () {
            return _super.prototype.render.call(this);
        };
        return UsageView;
    })(Sample.SourcecodeView);
    Sample.UsageView = UsageView;
})(Sample || (Sample = {}));
var Sample;
(function (Sample) {
    var MainView = (function (_super) {
        __extends(MainView, _super);
        function MainView() {
            _super.call(this);
            this.usage = new Sample.UsageView();
        }
        MainView.prototype.render = function () {
            this.$el.append(this.usage.render().$el);
            return this;
        };
        return MainView;
    })(showv.View);
    Sample.MainView = MainView;
})(Sample || (Sample = {}));
var Sample;
(function (Sample) {
    var WrapperView = (function (_super) {
        __extends(WrapperView, _super);
        function WrapperView() {
            _super.call(this, {
                id: 'wrapper'
            });
            this.header = new Sample.HeaderView();
            this.main = new Sample.MainView();
            this.footer = new Sample.FooterView();
        }
        WrapperView.prototype.render = function () {
            this.$el.append(this.header.render().$el, this.main.render().$el, this.footer.render().$el);
            return this;
        };
        return WrapperView;
    })(showv.View);
    Sample.WrapperView = WrapperView;
})(Sample || (Sample = {}));
