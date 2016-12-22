import {Model} from "chomex";

export default class History extends Model {}

History.default = {
    "update-checked": {
        version: ""
    },
    "last-selected-frame": {
        id: "__white"
    },
    "custom-capture": {
        settings: []
    }
};
