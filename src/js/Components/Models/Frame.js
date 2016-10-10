import {Model} from "chomex";

export default class Frame extends Model {
    toCreatePrams(position) {
        let params = {
            url:    this.url,
            width:  this.size.width,
            height: this.size.height,
            type:   "popup", // TODO: Firefox
        };
        if (position.left) params.left = position.left;
        if (position.top)  params.top  = position.top;
        return params;
    }
}

Frame.default = {
    "__white": {
        id: "__white",
        alias: "DEFAULT WHITE",
        url: "http://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854/",
        size: {width: 800, height: 480},
        decoration: "FRAME_SHIFT",
        protected: true,
    },
    "small": {
        id: "小型",
        alias: "小型",
        url: "http://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854/",
        size: {width: 400, height: 240},
        decoration: "EXTRACT",
        protected: true,
    },
};
