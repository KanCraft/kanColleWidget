var showv;
(function (showv) {
    var View = (function () {
        function View(options) {
            if (typeof options === "undefined") { options = {}; }
            this.ensureOptions(options);
            this.ensureElemens();
            this.delegateEvents();
        }
        View.prototype.ensureOptions = function (options) {
            this.tagName = options.tagName || 'div';
            this.className = options.className || '';
            this.id = options.id || '';
            this.delegate = (options.delegate == null) ? true : options.delegate;
            this.$el = options.$el || null;
            this.attr = options.attr || {};
            return this;
        };
        View.prototype.ensureElemens = function () {
            this.$el = this.$el || $('<' + this.tagName + '>');
            var _attrs = this.attr;
            if (this.id)
                _attrs['id'] = this.id;
            if (this.className)
                _attrs['class'] = this.className;
            this.$el.attr(_attrs);
            return this;
        };

        View.prototype.events = function () {
            return {};
        };

        View.prototype.delegateEvents = function () {
            var _this = this;
            var _events = this.events();
            $.map(_events, function (eventFunctionName, eventNameAndSelector) {
                var pair = _this.splitEventAndSelector(String(eventNameAndSelector));
                var fn = function (ev) {
                    _this[_events[pair.rawKey]].call(_this, ev);
                };
                _this.$el.on.call(_this.$el, pair.evName, pair.selector, fn);
            });
            return this;
        };

        View.prototype.splitEventAndSelector = function (eventNameAndSelector) {
            var splits = eventNameAndSelector.split(' ');
            return {
                rawKey: eventNameAndSelector,
                evName: splits[0],
                selector: splits[1]
            };
        };

        View.prototype.render = function () {
            return this;
        };
        return View;
    })();
    showv.View = View;
})(showv || (showv = {}));
