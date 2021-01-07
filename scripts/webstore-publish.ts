/** webstore-publish.ts
 * Chrome拡張をChromeウェブストアに公開するスクリプト
 * @see https://developer.chrome.com/webstore/using_webstore_api
 * @see https://developer.chrome.com/webstore/webstore_api/items/publish
 *
 * @param {string} client_id
 * @param {string} client_secret
 * @param {string} refresh_token
 * @param {string} app_id
 * @param {string} zip_file_path
 */

import nodefetch, { Response } from "node-fetch";
import * as fs from "fs";
import { URLSearchParams } from "url";

// https://developer.chrome.com/docs/webstore/using_webstore_api/#overview
interface AuthResponse {
  access_token: string,
  token_type: string,
  expires_in: number,
  refresh_token: string,
}

/** refreshAccessToken
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
 * @return {Promise<Response>}
 * {access_token, expires_in, scope, token_type}
 */
async function refreshAccessToken(
  client_id: string,
  client_secret: string,
  refresh_token: string
): Promise<Response> {
  return nodefetch("https://www.googleapis.com/oauth2/v4/token", {
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

/** uploadPackageFile
 * ちゃんとリフレッシュされてるアクセストークンを使って、
 * 指定されたファイルを指定されたアプリにアップロードする.
 * まだpublishされてないので注意.
 *
 * @param {string} access_token
 * @param {string} zip_file_path
 * @param {string} app_id
 *
 * @return {Promise<Response>}
 */
async function uploadPackageFile(
  access_token: string,
  zip_file_path: string,
  app_id: string
): Promise<Response> {
  return nodefetch(`https://www.googleapis.com/upload/chromewebstore/v1.1/items/${app_id}`, {
    method: "PUT",
    headers: { "Authorization": `Bearer ${access_token}`, "x-goog-api-version": "2" },
    body: fs.createReadStream(zip_file_path),
  });
}

/** publishUploadedPackageFile
 * パブリッシュする.
 *
 * @param {string} access_token
 * @param {string} app_id
 * @param {boolean} trustedTesters
 *
 * @return {Promise<Response>}
 */
async function publishUploadedPackageFile(
  access_token: string,
  app_id: string,
  trustedTesters: boolean
) {
  const query = new URLSearchParams({ publishTarget: trustedTesters ? "trustedTesters" : "default" });
  return nodefetch(`https://www.googleapis.com/chromewebstore/v1.1/items/${app_id}/publish?${query.toString()}`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${access_token}`, "x-goog-api-version": "2", "Content-Length": "0" },
  });
}

/** このスクリプトのデフォルトエクスポート
 * __main__的なもの
 */
async function main(
  zip_file_path: string,
  client_id: string = process.env.GOOGLEAPI_CLIENT_ID,
  client_secret: string = process.env.GOOGLEAPI_CLIENT_SECRET,
  refresh_token: string = process.env.GOOGLEAPI_REFRESH_TOKEN,
  app_id: string = process.env.CHROMEWEBSTORE_APP_ID
) {
  console.log("[DEBUG]", "ZIP FILE PATH:", zip_file_path);
  const refreshResponse = await refreshAccessToken(client_id, client_secret, refresh_token);
  const body: AuthResponse  = await refreshResponse.json();
  const access_token = body.access_token;
  if (!access_token) throw new Error("couldn't retrieve access_token from this refresh_token");
  const uploadResponse = await uploadPackageFile(access_token, zip_file_path, app_id);
  console.log("[DEBUG]", "UPLOAD PACKAGE FILE:\n", await uploadResponse.json());
  const publishResponse = await publishUploadedPackageFile(access_token, app_id, process.env.NODE_ENV != "production");
  console.log("[DEBUG]", "PUBLISH PACKAGE:\n", await publishResponse.json());
}

module.exports = main; // default
module.exports.refreshAccessToken         = refreshAccessToken;
module.exports.uploadPackageFile          = uploadPackageFile;
module.exports.publishUploadedPackageFile = publishUploadedPackageFile;

// 直接呼ばれたときにやるやつ
if (require.main == module) {
  if (process.argv.length < 3) {
    console.error("argument `zip_file_path` is required");
    process.exit(1);
  }
  const zip_file_path = process.argv[2];
  if (!fs.existsSync(zip_file_path)) {
    console.error(`zip file is not found on path ${zip_file_path}`);
    process.exit(1);
  }
  main(zip_file_path).catch(err => {
    // StatusCodeError: 400 - "{\"error\":{\"errors\":[{\"domain\":\"global\",\"reason\":\"badRequest\",\"message\":\"Publish condition not met: \"}],\"code\":400,\"message\":\"Publish condition not met: \"}}"
    console.error("[ERROR]", err.message);
    console.log(err);
    process.exit(1);
  });
}