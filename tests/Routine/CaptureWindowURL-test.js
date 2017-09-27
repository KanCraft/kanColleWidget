jest.unmock("../../src/js/Application/Routine/CaptureWindowURL");
import CaptureWindowURL from "../../src/js/Application/Routine/CaptureWindowURL";

describe("CaptureWindowURL", () => {
  describe("params", () => {
    describe("与えられた画像URIが十分小さい時", () => {
      it("画像URIそのものである`img`を持つURLSearchParamsをresolveする", () => {
        let cap = new CaptureWindowURL(Date.now());
        let uri = "foobarbaz";
        return new Promise((resolve, reject) => {
          cap.params(uri).then(params => {
            if (params.get("img") == uri) resolve();
            else reject();
          });
        });
      });
    });
    describe("与えられた画像URIが十分大きい時", () => {
      let now = Date.now();
      let cap = new CaptureWindowURL(now, 1);
      let uri = "foobarbazfoobarbaz";
      it("画像URIの置き場所を示す`datahash`を持つURLSearchParamsをresolveする", () => {
        return new Promise((resolve, reject) => {
          cap.params(uri).then(params => {
            if (params.get("datahash") == `kcw:tmp:deckimage:${now}`) resolve();
            else reject("datahashが無い");
          });
        });
      });
      it("画像URIの置き場所には与えられたURIが保存されている", () => {
        return new Promise((resolve, reject) => {
          cap.params(uri).then(params => {
            chrome.storage.local.get(params.get("datahash"), (items) => {
              if (items[params.get("datahash")] == uri) resolve();
              else reject();
            });
          });
        });
      });
    });
  });
});
