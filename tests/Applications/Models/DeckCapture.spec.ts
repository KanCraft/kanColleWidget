import DeckCapture from "../../../src/js/Applications/Models/DeckCapture";

describe("DeckCapture", () => {
  it("なんやこれ", () => {
    const dc = new DeckCapture(); 
    expect(dc).toBeInstanceOf(DeckCapture);
  });
});
