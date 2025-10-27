/**
 * X API v2の公式ルールに基づいて文字の重み（weight）を計算
 * - CJK文字（日本語・中国語・韓国語）: 2文字
 * - 絵文字: 2文字
 * - URL: 23文字（実際の長さに関わらず）
 * - その他: 1文字
 * @see https://docs.x.com/fundamentals/counting-characters
 */
export const calculateTwitterWeight = (text: string): number => {
  let weight = 0;

  // URLを先に抽出して23文字として計算
  const urlRegex = /https?:\/\/[^\s]+/g;
  const urls: string[] = [];
  const textWithoutUrls = text.replace(urlRegex, (match) => {
    urls.push(match);
    return "\u0000".repeat(match.length); // プレースホルダー
  });

  const chars = Array.from(textWithoutUrls);

  for (const char of chars) {
    // URLプレースホルダーはスキップ
    if (char === "\u0000") {
      continue;
    }

    const code = char.codePointAt(0);
    if (!code) {
      weight += 1;
      continue;
    }

    // CJK文字範囲（中国語・日本語・韓国語）
    if (
      (code >= 0x3000 && code <= 0x303f) || // CJK記号・句読点
      (code >= 0x3040 && code <= 0x309f) || // ひらがな
      (code >= 0x30a0 && code <= 0x30ff) || // カタカナ
      (code >= 0x4e00 && code <= 0x9faf) || // CJK統合漢字
      (code >= 0xff00 && code <= 0xffef) // 全角英数字
    ) {
      weight += 2;
      continue;
    }

    // 絵文字範囲（基本的な絵文字ブロック）
    if (
      (code >= 0x1f300 && code <= 0x1f9ff) || // 各種絵文字
      (code >= 0x2600 && code <= 0x27bf) // その他の記号
    ) {
      weight += 2;
      continue;
    }

    // デフォルト（ラテン文字、数字、基本記号など）
    weight += 1;
  }

  // URL分を追加
  weight += urls.length * 23;

  return weight;
};

// Xの投稿可能な最大文字数
// @see https://docs.x.com/fundamentals/counting-characters
export const MAX_TWEET_LENGTH = 280;
