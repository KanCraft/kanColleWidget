import { RectParam } from "../../../Services/Rectangle";

const catalog: { [name: string]: RectParam } = {
  // 艦隊の座標
  fleet: {
    x: 39 / 100,
    y: 20 / 100,
    w: 60 / 100,
    h: 78 / 100,
  },
  // 基地航空隊の座標
  aviation: {
    x: 72 / 100,
    y: 22 / 100,
    w: 27 / 100,
    h: 73 / 100,
  },
};
export default catalog;
