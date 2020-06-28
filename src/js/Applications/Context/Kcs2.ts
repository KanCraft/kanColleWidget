import { Router } from "chomex";
import DamageSnapshot from "./Features/DamageSnapshot";

/**
 * iframe内のclickイベントを拾いたいので、
 * DMMではなく、iframe内部のkcsなページのイベントハンドラを登録するContextです。
 */
export default class Kcs2 {

  private snapshot: DamageSnapshot;

  constructor(private scope: Window) {
    this.snapshot = new DamageSnapshot(scope);
  }

  async init() {
    console.log("[Kcs2.init]", this.scope.location.hostname);
  }

  listener(): (message: any) => any {
    const router = new Router();
    router.on("/snapshot/prepare", (m) => this.snapshot.prepare(m));
    router.on("/snapshot/show", (m) => this.snapshot.show(m));
    router.on("/snapshot/remove", () => this.snapshot.remove());
    return router.listener();
  }
}
