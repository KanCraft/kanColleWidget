// jest.unmock('chomex');
jest.unmock("../../../src/js/Components/Models/History");
import History from "../../../src/js/Components/Models/History";

describe("model History", () => {
  describe("class", () => {
    it("shold do something", () => {
      let history = new History({value: "this is foo"}, "foo");
      history.save();

      let foo = History.find("foo");
      expect(foo.value).toBe("this is foo");

    });
  });
});
