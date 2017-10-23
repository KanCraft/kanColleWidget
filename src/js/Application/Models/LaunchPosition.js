import {Model} from "chomex";

export default class LaunchPosition extends Model {}

LaunchPosition.default = {
  "default": {
    left: 100,
    top:  100,
    architrave: {x:0, y:0},
  },
  "dashboard": {
    left: 0,
    top:  0,
    width:  430,
    height: 292,
    architrave: {x:0, y:0},
  },
  "dsnapshot": {
    left: 0,
    top:  0,
    width:  124,
    height: 200,
    architrave: {x:0, y:0},
  },
};
