import Tesseract from "tesseract.js";

export default class OCRService {
  constructor(
    private url: string = "https://ocr-api-wskputa3za-an.a.run.app/base64"
  ) {}

  /**
   * Base64形式のimageを受けて、OCRのうえ、ミリ秒に変換して返す
   * @param {string} base64 Base64形式の画像データ（data:image/jpeg;base64,xxxxx....)
   * @returns {string} text OCR結果
   * @returns {number} time ミリ秒
   */
  async fromBase64(base64: string): Promise<{ text: string; time: number }> {
    const text = await this.base64toText(base64);
    return { text, time: this.textToMillisecond(text) };
  }

  async base64toText(base64: string): Promise<string> {
    const res = await Tesseract.recognize(base64);
    return res.data.text.trim();
  }

  textToMillisecond(text: string): number {
    const [h, m, s] = text.trim().split(":").map(p => parseInt(p, 10));
    return (h * (60 * 60) + m * (60) + s) * 1000;
  }
}