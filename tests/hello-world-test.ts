import hello from "../src/js/hello-world";

describe("hello-world", () => {
  describe("hello", () => {
    it("should repeat message twice as default", () => {
      expect(hello("Hello")).toBe("Hello,Hello");
    });
    it("should repeat message with specified times", () => {
      expect(hello("Hello", 4)).toBe("Hello,Hello,Hello,Hello");
    });
  });
});
