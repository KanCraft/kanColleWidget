import {Model} from "chomex";

export default class Frame extends Model {
    toCreatePrams(position) {
        let params = {
            url:    this.url,
            width:  this.size.width,
            height: this.size.height,
            type:   (this.decoration == "FRAME_SHIFT" && this.addressbar) ? "normal": "popup",
        };
        if (position.left) params.left = position.left;
        if (position.top)  params.top  = position.top;
        return params;
    }
    valid() {
        if (!this.id || !this.alias) return false;
        if (this.id != this.alias) return false; // とりあえず
        if (parseInt(this.size.width) != this.size.width) return false;
        if (parseInt(this.size.height) != this.size.height) return false;
        if (this.size.width < 10 || this.size.height < 10) return false;
        return true;
    }
    // XXX: これでいいんかなー. validateにくっつけたほうがいいかも
    regulate() {
        this.size.width    = parseInt(this.size.width);
        this.size.height   = parseInt(this.size.height);
        this.position      = this.position || {};
        this.position.left = parseInt(this.position.left);
        this.position.top  = parseInt(this.position.top);
        this.zoom          = parseFloat(this.zoom);
        this.addressbar    = !!this.addressbar;
        return this;
    }
    static template() {
        return new Frame({
            id: "",
            alias: "",
            url: "http://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854/",
            size: {width: 800, height: 480},
            zoom: 1.0,
            position: {top: -77, left: -124},
            decoration: "FRAME_SHIFT",
            protected: false
        });
    }
}

Frame.default = {
    "__white": {
        id: "__white",
        alias: "DEFAULT WHITE",
        url: "http://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854/",
        size: {width: 800, height: 480},
        zoom: 1.0,
        position: {top: -77, left: -124},
        decoration: "FRAME_SHIFT",
        protected: true,
        addressbar: false,
    },
    "small": {
        id: "小型",
        alias: "小型",
        url: "http://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854/",
        size: {width: 400, height: 240},
        zoom: 1.0,
        position: {},
        decoration: "EXTRACT",
        protected: true,
        addressbar: false,
    },
};
