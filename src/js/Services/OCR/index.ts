
export default class OCRService {

  private readonly url;

  constructor(
    url: string | null = null
  ) {
    this.url = url || "https://api-kcwidget.herokuapp.com/ocr/base64"
  }

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
    const res = await fetch(this.url, {
      body: JSON.stringify({ base64, whitelist: "0123456789:" }),
      method: "POST",
    });
    const { result: text } = await res.json();
    return text;
  }

  textToMillisecond(text: string): number {
    const [h, m, s] = text.trim().split(":").map(p => parseInt(p, 10));
    return (h * (60 * 60) + m * (60) + s) * 1000;
  }
}
