import Queue, { Scanned, Kind } from "./Queue";

export default class Shipbuilding extends Queue {

  static __ns = Kind.Shipbuilding;

  static scan(clean = true): Scanned<Shipbuilding> {
    return super._scan<Shipbuilding>(Shipbuilding, Date.now(), clean);
  }

  dock: number | string;
  time: number;
  text: string;

  register(scheduled: number): Shipbuilding {
    return super._register<Shipbuilding>(scheduled);
  }

  registeredOn(dock: number | string) {
    return this.dock == dock;
  }

  getTimerLabel() {
    return `第${this.dock}ドック 建造`;
  }
}
