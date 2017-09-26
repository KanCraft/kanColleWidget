import {Model}   from "chomex";
import Rectangle from "../../Services/Rectangle";

export default class DeckCaptureConfig extends Model {
  static nextID = Model.sequentialID;
  static schema = {
    protected: Model.Types.bool,
    labels:    Model.Types.array,
    name:      Model.Types.string.isRequired,
    row:       Model.Types.number.isRequired,
    col:       Model.Types.number.isRequired,
    rect:      Model.Types.shape({
      x:      Model.Types.number.isRequired,
      y:      Model.Types.number.isRequired,
      width:  Model.Types.number.isRequired,
      height: Model.Types.number.isRequired,
    }).isRequired,
  }
  static default = {
    "normal": {
      name: "編成キャプチャ",
      row: 3, col: 2,
      rect: Rectangle.catalog.defaultDeckcapture,
      protected: true,
    },
    "combined": {
      name: "連合編成キャプチャ",
      row: 3, col: 2,
      rect: Rectangle.catalog.defaultDeckcapture,
      protected: true,
      panels: 2,
      labels: ["第一艦隊", "第二艦隊"],
    },
    "aviation": {
      name: "基地航空隊",
      row: 1, col: 3,
      rect: Rectangle.catalog.defaultAviation,
      protected: true,
    },
  }
}
