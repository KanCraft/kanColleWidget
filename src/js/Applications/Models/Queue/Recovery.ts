import Queue from "./Queue";

export default class Recovery extends Queue {

  public static for(dock: number | string): Recovery {
    return Recovery.new({ dock });
  }

  public dock: number | string;

  public register(scheduled: number): Recovery {
    return super._register<Recovery>(scheduled);
  }

}
