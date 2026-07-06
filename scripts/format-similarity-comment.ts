/**
 * similarity-ts の生出力を PR コメント用の Markdown に整形する
 */

import { readFileSync } from "node:fs";

const main = () => {
  const [, , inputPath] = process.argv;
  if (!inputPath) {
    console.error("使い方: tsx format-similarity-comment.ts <similarity-tsの生出力ファイル>");
    process.exit(1);
  }

  const raw = readFileSync(inputPath, "utf-8");

  const functionMatch = raw.match(/Found (\d+) duplicate pairs/);
  const functionCount = functionMatch ? Number(functionMatch[1]) : 0;

  const typeMatch = raw.match(/Total similar type pairs found: (\d+)/);
  const typeCount = typeMatch ? Number(typeMatch[1]) : 0;

  const header = "## 🔍 similarity-ts: コード類似度チェック";

  if (functionCount === 0 && typeCount === 0) {
    console.log(`${header}\n\n✅ 重複コードは検出されませんでした。`);
    return;
  }

  console.log(
    [
      header,
      "",
      `関数の重複: **${functionCount}** 件 / 型の類似: **${typeCount}** 件`,
      "",
      "<details><summary>詳細を表示</summary>",
      "",
      "```",
      raw.trim(),
      "```",
      "",
      "</details>",
    ].join("\n"),
  );
};

main();
