import { Router } from "chomex/lib/Router";
import DamageSnapshot from "./Features/DamageSnapshot";

export default class Kcs2 {

  private snapshot: DamageSnapshot;

  constructor(private scope: Window) {
    this.snapshot = new DamageSnapshot(scope);
  }

  public async init() {
    // do nothing so far
  }

  public listener(): (message: any) => any {
    const router = new Router();
    router.on("/snapshot/prepare", (m) => this.snapshot.prepare(m.count));
    router.on("/snapshot/show", (m) => this.snapshot.show(m.uri));
    router.on("/snapshot/remove", () => this.snapshot.remove());
    return router.listener();
  }
}
