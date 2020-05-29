import OCRService from "../../src/js/Services/OCR";
import { Fetch } from "../tools";

describe("OCRService", () => {
  describe("foo", () => {
    it("should return text", async () => {
      Fetch.replies({result: "12:34:56"});
      const ocr = new OCRService();
      const { text, time } = await ocr.fromBase64("data:image/jpeg;base64,...");
      expect(text).toBe("12:34:56");
      expect(time).toBe((12 * 60 * 60 + 34 * 60 + 56) * 1000);
    });
  });
});
