import {Model} from "chomex";

export default class LaunchPosition extends Model {}

LaunchPosition.default = {
    "default": {
        left: 100,
        top:  100
    },
    "dashboard": {
        left: 0,
        top:  0,
        width:  400,
        height: 292
    },
};
