/** publish.js
 * Chrome拡張をChromeウェブストアに公開するスクリプト
 * @see https://developer.chrome.com/webstore/using_webstore_api
 *
 * @param {string} client_id
 * @param {string} client_secret
 * @param {string} refresh_token
 * @param {string} app_id
 * @param {string} zip_file_path
 */

var request = require("request-promise");
var fs      = require('fs');

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
 * @return {Promise<{access_token, expires_in, scope, token_type}>}
 */
function refreshAccessToken(client_id, client_secret, refresh_token) {
  return request.post("https://www.googleapis.com/oauth2/v4/token", {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    form: {
      client_id: client_id,
      client_secret: client_secret,
      refresh_token: refresh_token,
      grant_type: "refresh_token",
    }
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
 * @return {Promise}
 */
function uploadPackageFile(access_token, zip_file_path, app_id) {
  return request.put(`https://www.googleapis.com/upload/chromewebstore/v1.1/items/${app_id}`, {
    method: "PUT",
    headers: {
      "Authorization":      `Bearer ${access_token}`,
      "x-goog-api-version": "2",
    },
    formData: {
      file: fs.createReadStream(zip_file_path),
    },
  });
}

/** publishUploadedPackageFile
 * パブリッシュする.
 *
 * @param {string} access_token 
 * @param {string} app_id 
 */
function publishUploadedPackageFile(access_token, app_id) {
  return request.post(`https://www.googleapis.com/chromewebstore/v1.1/items/${app_id}/publish`, {
    method: "POST",
    headers: {
      "Authorization":      `Bearer ${access_token}`,
      "x-goog-api-version": "2",
      "Content-Length":     "0",
      "publishTarget":      "trustedTesters", // TODO: いずれちゃんと渡せるようにする
    }
  });
}

/** このスクリプトのデフォルトエクスポート
 * __main__的なもの
 */
function main(zip_file_path, client_id, client_secret, refresh_token, app_id) {
  client_id     = client_id     || process.env.GOOGLEAPI_CLIENT_ID;
  client_secret = client_secret || process.env.GOOGLEAPI_CLIENT_SECRET;
  refresh_token = refresh_token || process.env.GOOGLEAPI_REFRESH_TOKEN;
  app_id        = app_id        || process.env.CHROMEWEBSTORE_APP_ID;
  return refreshAccessToken(client_id, client_secret, refresh_token).then(res => {
    const access_token = JSON.parse(res).access_token;
    if (!access_token) throw new Error("couldn't retrieve access_token from this refresh_token");
    return Promise.resolve(access_token);
  }).then(access_token => {
    return uploadPackageFile(access_token, zip_file_path, app_id);
  }).then(res => {
    console.log(res);
    // return publishUploadedPackageFile(access_token, app_id);
  });
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
  main(zip_file_path);
}