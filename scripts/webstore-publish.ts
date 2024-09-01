/** webstore-publish.ts
 * ビルド済みzipファイルを受けてChrome拡張をChromeウェブストアに公開するスクリプト
 * @see https://developer.chrome.com/docs/webstore/using-api
 * @see https://developer.chrome.com/docs/webstore/api
 *
 * @env {string} GOOGLEAPI_CLIENT_ID         Google Cloud Consoleで作成したOAuth 2.0 クライアント ID
 * @env {string} GOOGLEAPI_CLIENT_SECRET     Google Cloud Consoleで作成したOAuth 2.0 クライアント シークレット
 * @env {string} GOOGLEAPI_REFRESH_TOKEN     Google OAuth 2.0 Playgroundで取得したリフレッシュトークン
 * @env {string} CHROMEWEBSTORE_EXTENSION_ID Chromeウェブストアで取得した拡張機能ID
 * @env {string} NODE_ENV                    デフォルトは"production"、"development"の場合はtrusted_testers=true
**/

import fs from "fs";

const __main__ = async () => {
  if (process.argv.length < 3) {
    console.error("zip file path is required.");
    console.error("Usage: node webstore-publish.ts <zip_file_path>");
    process.exit(1);
  }
  const [/* nodepath */, /* _scriptpath */, zip_file_path] = process.argv;
  if (!fs.existsSync(zip_file_path)) {
    console.error(`zip file not found: ${zip_file_path}`);
    process.exit(1);
  }
  try {
    await __webstore_publish__(zip_file_path);
  } catch (e) {
    console.error("[ERROR]", e);
    process.exit(1);
  }
};

const __webstore_publish__ = async (
  zip_file_path:   string,
  client_id:       string = process.env.GOOGLEAPI_CLIENT_ID!,
  client_secret:   string = process.env.GOOGLEAPI_CLIENT_SECRET!,
  refresh_token:   string = process.env.GOOGLEAPI_REFRESH_TOKEN!,
  extension_id:    string = process.env.CHROMEWEBSTORE_EXTENSION_ID!,
  trusted_testers: boolean = false, // process.env.NODE_ENV !== "production", // Betaもリンク知ってるひとに公開なので false でいい
) => {
  console.log("[INFO]", "START PUBLISHING...");

  // (1) リフレッシュトークンを使ってアクセストークンを取得
  const refreshResponse = await refreshAccessToken(client_id, client_secret, refresh_token);
  const authbody = (await refreshResponse.json()) as OAuthResponse;
  const { access_token, token_type, scope, expires_in } = authbody;
  if (!refreshResponse.ok) throw new Error(`http response of REFRESH is NOT OK: ${refreshResponse.statusText}\n${JSON.stringify(authbody)}`,);
  console.log("[INFO]", "ACCESS TOKEN REFRESHED:", token_type, scope, expires_in);
  if (!access_token) throw new Error(`couldn't retrieve access_token from this refresh_token`);

  // (2) アクセストークンを使ってzipファイルをアップロード
  const uploadResponse = await uploadPackageFile(access_token, zip_file_path, extension_id);
  const uploadbody = await uploadResponse.json();
  console.log("[INFO]", "UPLOAD PACKAGE FILE:", uploadResponse.ok, uploadResponse.status);
  if (!uploadResponse.ok) throw new Error(`http response of UPLOAD is NOT OK: ${uploadResponse.statusText}\n${JSON.stringify(uploadbody)}`);
  console.log("[INFO]", "UPLOAD SUCCESSFULLY DONE:", uploadbody);

  // (3) アップロードしたzipファイルを公開申請
  const publishResponse = await publishUploadedPackageFile(access_token, extension_id, trusted_testers);
  const publishbody = await publishResponse.json();
  console.log("[INFO]", "PUBLISH NEW PACKGE:", publishResponse.ok, publishResponse.status);
  if (!publishResponse.ok) throw new Error(`http response of PUBLISH is NOT OK: ${publishResponse.statusText}\n${JSON.stringify(publishbody)}`);
  console.log("[INFO]", "PUBLISH SUCCESSFULLY DONE:", publishbody);
};

/**
 * OAuth 2.0 レスポンス
 * @see https://developer.chrome.com/docs/webstore/using-api?hl=ja#test-oauth
**/
interface OAuthResponse {
  access_token:  string;
  expires_in:    number;
  refresh_token: string;
  token_type:    string;
  scope:         string;
}

/**
 * refreshAccessToken
 * デフォルトでは、得られた access_token は40分でExpireするため、
 * publishのAPIを叩く前に、必ずここで access_token を新たに取得
 * する必要がある.
 * ということで、こいつは refresh_token なんかを使って access_token
 * を得るメソッドです。
 * 
 * @param {string} client_id 
 * @param {string} client_secret 
 * @param {string} refresh_token 
 * 
 * @returns {Promise<OAuthResponse>} 
 */
async function refreshAccessToken(
  client_id: string,
  client_secret: string,
  refresh_token: string
): Promise<Response> {
  return fetch("https://www.googleapis.com/oauth2/v4/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: client_id,
      client_secret: client_secret,
      refresh_token: refresh_token,
      grant_type: "refresh_token",
    }),
  });
}

/**
 * uploadPackageFile
 * ちゃんとリフレッシュされてるアクセストークンを使って、
 * 指定されたファイルを指定されたアプリにアップロードする.
 * まだpublishされてないので注意.
 * 
 * @param {string} access_token 
 * @param {string} zip_file_path 
 * @param {string} extension_id 
 * 
 * @returns {Promise<Response>}
 */
async function uploadPackageFile(
  access_token: string,
  zip_file_path: string,
  extension_id: string
): Promise<Response> {
  const buf = fs.readFileSync(zip_file_path);
  return fetch(`https://www.googleapis.com/upload/chromewebstore/v1.1/items/${extension_id}`, {
    method: "PUT",
    headers: { "Authorization": `Bearer ${access_token}`, "x-goog-api-version": "2" },
    body: Buffer.from(buf),
  });
}

/**
 * publishUploadedPackageFile
 * パブリッシュする.
 *
 * @param {string} access_token
 * @param {string} extension_id
 * @param {boolean} trustedTesters
 *
 * @return {Promise<Response>}
 */
async function publishUploadedPackageFile(
  access_token: string,
  extension_id: string,
  trustedTesters: boolean
) {
  const query = new URLSearchParams({ publishTarget: trustedTesters ? "trustedTesters" : "default" });
  return fetch(`https://www.googleapis.com/chromewebstore/v1.1/items/${extension_id}/publish?${query.toString()}`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${access_token}`, "x-goog-api-version": "2", "Content-Length": "0" },
  });
}

// Entrypoint
__main__();
