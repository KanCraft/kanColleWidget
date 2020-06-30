import Queue, { Scanned, Kind } from "./Queue";

export default class Recovery extends Queue {

  static __ns = Kind.Recovery;

  static offset = 1000 * 60; // 1分前通知とかいうやつ

  static scan(clean = true): Scanned<Recovery> {
    return super._scan<Recovery>(Recovery, Date.now(), clean);
  }

  dock: number | string;
  time: number;
  text: string;

  register(scheduled: number): Recovery {
    return super._register<Recovery>(scheduled - Recovery.offset);
  }

  registeredOn(dock: number | string) {
    return this.dock == dock;
  }

  getTimerLabel() {
    return `第${this.dock}ドック 修復`;
  }
}
