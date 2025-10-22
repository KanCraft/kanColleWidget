/**
 * テスト投稿用スクリプト
 * Bot アカウントの環境変数を利用して X API v2 に投稿する
 */

import "dotenv/config";
import crypto from "node:crypto";

type TweetResponse =
  | { data: { id: string; text: string } }
  | { errors: Array<{ message: string; parameter?: string }> };

const REQUIRED_ENV = [
  "X_BOT_API_KEY",
  "X_BOT_API_KEY_SECRET",
  "X_BOT_ACCESS_TOKEN",
  "X_BOT_ACCESS_TOKEN_SECRET",
] as const;

const ENDPOINT = new URL("https://api.x.com/2/tweets");

interface PostOptions {
  mention?: string;
}

const main = async () => {
  const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error("環境変数が不足しています:", missing.join(", "));
    process.exit(1);
  }

  const [, , ...args] = process.argv;

  const { options, messageArgs } = extractOptions(args);
  const baseText = messageArgs.join(" ").trim() || `テスト投稿 ${new Date().toISOString()}`;
  const text = appendMention(baseText, options);

  if (text.length > 280) {
    console.error("投稿文字数が 280 文字を超えています");
    process.exit(1);
  }

  const authorization = buildOAuthHeader({
    method: "POST",
    url: ENDPOINT,
    consumerKey: process.env.X_BOT_API_KEY!,
    consumerSecret: process.env.X_BOT_API_KEY_SECRET!,
    accessToken: process.env.X_BOT_ACCESS_TOKEN!,
    accessTokenSecret: process.env.X_BOT_ACCESS_TOKEN_SECRET!,
  });

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: authorization,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ text }),
  });

  const body = (await response.json()) as TweetResponse;

  if (!response.ok || "errors" in body) {
    console.error("[ERROR] 投稿に失敗しました:", JSON.stringify(body, null, 2));
    process.exit(1);
  }

  console.log("[SUCCESS] 投稿しました:", body.data.id, body.data.text);
};

interface OAuthConfig {
  method: "POST" | "GET";
  url: URL;
  consumerKey: string;
  consumerSecret: string;
  accessToken: string;
  accessTokenSecret: string;
}

const buildOAuthHeader = (config: OAuthConfig) => {
  const nonce = crypto.randomUUID().replace(/-/g, "");
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const baseUrl = `${config.url.origin}${config.url.pathname}`;

  const oauthParams: Record<string, string> = {
    oauth_consumer_key: config.consumerKey,
    oauth_nonce: nonce,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: timestamp,
    oauth_token: config.accessToken,
    oauth_version: "1.0",
  };

  const signatureParams = [
    ...Object.entries(oauthParams),
    ...Array.from(config.url.searchParams.entries()),
  ].sort(sortParams);

  const parameterString = signatureParams
    .map(([key, value]) => `${percentEncode(key)}=${percentEncode(value)}`)
    .join("&");

  const signatureBase = [
    config.method.toUpperCase(),
    percentEncode(baseUrl),
    percentEncode(parameterString),
  ].join("&");

  const signingKey = `${percentEncode(config.consumerSecret)}&${percentEncode(config.accessTokenSecret)}`;
  const signature = crypto.createHmac("sha1", signingKey).update(signatureBase).digest("base64");

  const headerParams: Record<string, string> = {
    ...oauthParams,
    oauth_signature: signature,
  };

  const headerString = Object.entries(headerParams)
    .sort(sortParams)
    .map(([key, value]) => `${percentEncode(key)}="${percentEncode(value)}"`)
    .join(", ");

  return `OAuth ${headerString}`;
};

const sortParams = ([aKey, aValue]: [string, string], [bKey, bValue]: [string, string]) =>
  aKey === bKey ? aValue.localeCompare(bValue) : aKey.localeCompare(bKey);

const percentEncode = (input: string) =>
  encodeURIComponent(input).replace(/[!*()']/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`);

main().catch((error) => {
  console.error("[ERROR] 予期せぬ失敗:", error);
  process.exit(1);
});

const extractOptions = (argv: string[]): { options: PostOptions; messageArgs: string[] } => {
  const options: PostOptions = {};
  const message: string[] = [];

  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];
    if (!arg.startsWith("--")) {
      message.push(arg);
      continue;
    }
    if (arg === "--mention") {
      const value = argv[++index];
      if (!value) {
        console.warn("--mentionにはユーザー名を指定してください");
        continue;
      }
      options.mention = normalizeHandle(value);
      continue;
    }
    console.warn("未対応のオプションを無視します:", arg);
  }

  return { options, messageArgs: message };
};

const normalizeHandle = (input: string): string => {
  const trimmed = input.trim().replace(/^@+/, "");
  return trimmed.length > 0 ? trimmed : "";
};

const appendMention = (text: string, options: PostOptions): string => {
  if (!options.mention) {
    return text;
  }
  const mention = `@${options.mention}`;
  const candidate = text ? `${mention} ${text}` : mention;
  if (candidate.length > 280) {
    console.warn("メンションを付与すると280文字を超えるため省略しました");
    return text;
  }
  return candidate;
};
