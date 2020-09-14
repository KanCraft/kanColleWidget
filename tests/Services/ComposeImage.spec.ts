import ComposeImageService from "../../src/js/Services/ComposeImage";
import DeckCapture from "../../src/js/Applications/Models/DeckCapture";

describe("ComposeImage", () => {
  it("デフォの編成キャプチャ", async () => {
    const deckcapture = DeckCapture.find<DeckCapture>("normal");
    const service = ComposeImageService.withStrategyFor(deckcapture);
    expect(service).toBeInstanceOf(ComposeImageService);
    await service.compose(["aa", "bb", "cc"]);
  });
  it("連合艦隊編成キャプチャ", async () => {
    const combined = DeckCapture.find<DeckCapture>("combined");
    const service = ComposeImageService.withStrategyFor(combined);
    expect(service).toBeInstanceOf(ComposeImageService);
    await service.compose(["aa", "bb", "cc", "dd", "ee", "ff", "gg", "hh", "ii"]);
  });
});