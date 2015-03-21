/// <reference path="../definitions/jquery/jquery.d.ts" />

module showv {
    export interface IViewCreateOptions {
        tagName?:   string;
        className?: string;
        id?:        string;
        delegate?:  boolean;
        $el?:       JQuery;
        attr?:      Object;
    }
    export interface IEventSelectorPair {
        rawKey:   string;
        evName:   string;
        selector: string;
    }
    export class View {

        tagName:   string;
        className: string;
        id:        string;
        delegate: boolean;
        attr:      Object;

        $el:       JQuery;

        constructor(options: IViewCreateOptions = {}) {
            this.ensureOptions(options);
            this.ensureElemens();
            this.delegateEvents();
        }

        private ensureOptions(options: IViewCreateOptions): View {
            this.tagName   = options.tagName || 'div';
            this.className = options.className || '';
            this.id        = options.id || '';
            this.delegate  = (options.delegate == null) ? true : options.delegate;
            this.$el       = options.$el || null;
            this.attr      = options.attr || {};
            return this;
        }
        private ensureElemens(): View {
            this.$el = this.$el || $('<' + this.tagName + '>');
            var _attrs = this.attr;
            if (this.id) _attrs['id'] = this.id;
            if (this.className) _attrs['class'] = this.className;
            this.$el.attr(_attrs);
            return this;
        }

        // should be override
        events(): Object { return {}; }

        delegateEvents(): View {
            var _events = this.events();
            $.map(_events, (eventFunctionName, eventNameAndSelector) => {
                var pair = this.splitEventAndSelector(String(eventNameAndSelector));
                var fn = (ev: JQueryEventObject) => {
                    this[_events[pair.rawKey]].call(this, ev);
                };
                this.$el.on.call(this.$el, pair.evName, pair.selector, fn);
            });
            return this;
        }
        // TODO: Exception handling
        private splitEventAndSelector(eventNameAndSelector: string): IEventSelectorPair {
            var splits = eventNameAndSelector.split(' ');
            return {
                rawKey: eventNameAndSelector,
                evName: splits[0],
                selector: splits[1]
            };
        }

        render(): View {
            return this;
        }
    }
}
