import SoundService from "../../src/js/Services/Sound";

describe("SoundService", () => {
  HTMLMediaElement.prototype.play = () => Promise.resolve();
  describe("play", () => {
    it("音を再生したりする", () => {
      const sound = new SoundService("xxx", 0.2);
      sound.play();
    });
  });
});
