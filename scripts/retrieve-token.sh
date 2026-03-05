#!/bin/bash

set -euo pipefail

if [ ! -f .env ]; then
  echo ".env が見つかりません"
  exit 1
fi

source .env

if [ -z "${GOOGLEAPI_CLIENT_ID:-}" ] || [ -z "${GOOGLEAPI_CLIENT_SECRET:-}" ]; then
  echo "GOOGLEAPI_CLIENT_ID/GOOGLEAPI_CLIENT_SECRET を .env に設定してください"
  exit 1
fi

SCOPE="https://www.googleapis.com/auth/chromewebstore"

find_free_port() {
  node <<'NODE'
const net = require('node:net');
const server = net.createServer();
server.listen(0, '127.0.0.1', () => {
  const { port } = server.address();
  console.log(port);
  server.close(() => process.exit(0));
});
NODE
}

PORT=${OAUTH_LOOPBACK_PORT:-$(find_free_port)}
REDIRECT_URI="http://127.0.0.1:${PORT}"
STATE=$(LC_ALL=C tr -dc 'A-Za-z0-9' < /dev/urandom 2>/dev/null | head -c 24 || true)
TMP_CODE_FILE=$(mktemp)

cleanup() {
  if [ -n "${SERVER_PID:-}" ]; then
    kill "${SERVER_PID}" 2>/dev/null || true
  fi
  rm -f "${TMP_CODE_FILE}"
}

trap cleanup EXIT

node ./scripts/token-server.js "${PORT}" "${STATE}" "${TMP_CODE_FILE}" &
SERVER_PID=$!

AUTH_URL="https://accounts.google.com/o/oauth2/auth?response_type=code&scope=${SCOPE}&client_id=${GOOGLEAPI_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&access_type=offline&prompt=consent&state=${STATE}"

printf 'ブラウザで以下の URL を開いて Google に認可してください:\n%s\n' "${AUTH_URL}"
if command -v open >/dev/null 2>&1; then
  open "${AUTH_URL}" >/dev/null 2>&1 || true
elif command -v xdg-open >/dev/null 2>&1; then
  xdg-open "${AUTH_URL}" >/dev/null 2>&1 || true
fi

wait "${SERVER_PID}"

if [ ! -s "${TMP_CODE_FILE}" ]; then
  echo "認可コードを取得できませんでした"
  exit 1
fi

CODE=$(cat "${TMP_CODE_FILE}")

curl "https://accounts.google.com/o/oauth2/token" -d \
  "client_id=${GOOGLEAPI_CLIENT_ID}&client_secret=${GOOGLEAPI_CLIENT_SECRET}&code=${CODE}&grant_type=authorization_code&redirect_uri=${REDIRECT_URI}"
