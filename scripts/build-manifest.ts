/** build-manifest.ts
 * チャンネル(dev/beta/prod)に応じて dist/manifest.json を生成するロジック。
 *
 * 設計意図:
 *   - version の単一の真実源は package.json（base版）と git tag（出荷版）。
 *     manifest.json は「ビルド成果物」として常にここで生成し、git管理しない。
 *   - チャンネルごとの差分（name の接尾辞・アイコン）をこの1ファイルに集約する。
 *     従来 Makefile に散っていた jq / icon mv ロジックの置き換え。
 *
 * Vite プラグイン(vite.config.ts)と CLI の両方から呼ばれる。
 *   CLI 例: tsx scripts/build-manifest.ts --channel prod --version 4.9.0
 */

import fs from "node:fs";
import path from "node:path";

export type Channel = "dev" | "beta" | "prod";

const BASE_NAME = "艦これウィジェット";

/** チャンネルごとの拡張機能名（Chrome Webstore 上の表示名） */
export const CHANNEL_NAME: Record<Channel, string> = {
  dev: `${BASE_NAME}_DEV`,
  beta: `${BASE_NAME} (BETA)`,
  prod: BASE_NAME,
};

export interface ComposeOptions {
  channel: Channel;
  /** manifest.version。1〜4個のドット区切り整数（各 0〜65535）。 */
  version: string;
  /** 表示用の version_name。beta では "4.9.0-beta.5" のような SemVer 文字列を入れる。 */
  versionName?: string;
}

/**
 * Chrome の manifest.version 制約を検証する。
 * 1〜4個のドット区切り整数で、各要素は 0〜65535。
 * SemVer の prerelease 文字列（例 "4.9.0-beta.1"）は manifest.version には使えないため、
 * beta は第4成分にビルド番号を足した "4.9.0.5" 形式へ変換しておくこと。
 */
export function assertValidManifestVersion(version: string): void {
  const parts = version.split(".");
  if (parts.length < 1 || parts.length > 4) {
    throw new Error(`manifest.version は1〜4個のドット区切り整数である必要があります: ${version}`);
  }
  for (const part of parts) {
    if (!/^\d+$/.test(part)) {
      throw new Error(`manifest.version の各要素は整数である必要があります: ${version}`);
    }
    if (Number(part) > 65535) {
      throw new Error(`manifest.version の各要素は 65535 以下である必要があります: ${version}`);
    }
  }
}

/**
 * テンプレートオブジェクトにチャンネル別の name / version / version_name を注入した
 * 新しい manifest オブジェクトを返す純粋関数（fs に触れない）。
 */
export function composeManifest(
  template: Record<string, unknown>,
  opts: ComposeOptions,
): Record<string, unknown> {
  assertValidManifestVersion(opts.version);
  const manifest: Record<string, unknown> = { ...template };
  manifest.name = CHANNEL_NAME[opts.channel];
  manifest.version = opts.version;
  if (opts.versionName) {
    manifest.version_name = opts.versionName;
  } else {
    delete manifest.version_name;
  }
  // kcsapi リクエスト Recorder（src/services/RequestRecorder.ts）は localhost の dev サーバへ
  // リクエストを fetch POST する。これはローカル開発専用の可観測性機能で、beta / prod 成果物には
  // 絶対に含めない。dev チャンネルのときだけ localhost への host_permission を注入する
  // （RequestRecorder.enabled() がこの有無を実行時フラグの単一の真実源にする。
  //   template 本体は破壊しないよう配列を複製する）。
  if (opts.channel === "dev") {
    const hostPermissions = Array.isArray(template.host_permissions)
      ? [...(template.host_permissions as string[])]
      : [];
    if (!hostPermissions.includes("http://127.0.0.1/*")) hostPermissions.push("http://127.0.0.1/*");
    manifest.host_permissions = hostPermissions;
  }
  return manifest;
}

/**
 * dist にチャンネル別アイコンを配置する。
 *   - dev: ルートの icons/128.png, icons/480.png（= DEV用アイコン）をそのまま使う
 *   - beta/prod: icons/<channel>/*.png をルートへコピー
 * いずれの場合も dist/icons/{beta,prod} ディレクトリは最終成果物から削除する。
 */
function placeIcons(distDir: string, channel: Channel): void {
  const iconsDir = path.join(distDir, "icons");
  if (channel !== "dev") {
    const channelDir = path.join(iconsDir, channel);
    for (const file of ["128.png", "480.png"]) {
      fs.copyFileSync(path.join(channelDir, file), path.join(iconsDir, file));
    }
  }
  for (const dir of ["beta", "prod"]) {
    const target = path.join(iconsDir, dir);
    if (fs.existsSync(target)) fs.rmSync(target, { recursive: true, force: true });
  }
}

export interface ApplyOptions extends Omit<ComposeOptions, "version"> {
  /** 未指定なら package.json の version を base として使う */
  version?: string;
  /** 既定: <repo>/dist */
  distDir?: string;
  /** 既定: <repo>/src/public */
  srcPublicDir?: string;
}

/**
 * テンプレートを読み込み、dist/manifest.json を生成し、アイコンを配置する。
 * vite.config.ts の closeBundle と CLI の両方から呼ぶエントリ。
 */
export function applyChannelToDist(opts: ApplyOptions): void {
  const distDir = opts.distDir ?? path.resolve(process.cwd(), "dist");
  const srcPublicDir = opts.srcPublicDir ?? path.resolve(process.cwd(), "src/public");
  const version = opts.version || readPackageVersion();

  const templatePath = path.join(srcPublicDir, "manifest.template.json");
  const template = JSON.parse(fs.readFileSync(templatePath, "utf-8")) as Record<string, unknown>;

  const manifest = composeManifest(template, { ...opts, version });
  fs.writeFileSync(path.join(distDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

  placeIcons(distDir, opts.channel);

  // publicDir 経由で dist にコピーされたテンプレートは成果物に不要なので削除する
  const copiedTemplate = path.join(distDir, "manifest.template.json");
  if (fs.existsSync(copiedTemplate)) fs.rmSync(copiedTemplate);
}

function readPackageVersion(): string {
  const pkg = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "package.json"), "utf-8"));
  return pkg.version as string;
}

// ---- CLI ----------------------------------------------------------------

function parseArgs(argv: string[]): ApplyOptions {
  let channel: Channel = "dev";
  let version: string | undefined;
  let versionName: string | undefined;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--channel") channel = argv[++i] as Channel;
    else if (arg === "--version") version = argv[++i];
    else if (arg === "--version-name") versionName = argv[++i];
  }
  if (!["dev", "beta", "prod"].includes(channel)) {
    throw new Error(`--channel は dev|beta|prod のいずれかである必要があります: ${channel}`);
  }
  return { channel, version, versionName };
}

// tsx で直接実行されたときだけ CLI として動く（import 時は副作用なし）
if (process.argv[1] && process.argv[1].endsWith("build-manifest.ts")) {
  const opts = parseArgs(process.argv.slice(2));
  applyChannelToDist(opts);
  console.log(`[build-manifest] channel=${opts.channel} version=${opts.version}${opts.versionName ? ` version_name=${opts.versionName}` : ""}`);
}
