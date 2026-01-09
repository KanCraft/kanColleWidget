#!/usr/bin/env node

// Google が OOB フローを廃止したため、ローカルループバックで code/state を受け取る。

import http from 'node:http';
import { URL } from 'node:url';
import { writeFileSync } from 'node:fs';

const [, , portArg, expectedState, outfile] = process.argv;

if (!portArg || !expectedState || !outfile) {
  console.error('usage: token-server.js <port> <state> <outfile>');
  process.exit(1);
}

const port = Number(portArg);
if (Number.isNaN(port)) {
  console.error('port には数値を指定してください');
  process.exit(1);
}

const RESPONSE = {
  ok: '<p style="color: green; font-family: Helvetica;">認可コードを受信しました。このタブは閉じても構いません。</p>',
  missing: '<p style="color: red; font-family: Helvetica;">code パラメータが見つかりませんでした。</p>',
  state: '<p style="color: red; font-family: Helvetica;">state が一致しませんでした。</p>',
  write: '<p style="color: red; font-family: Helvetica;">ローカルファイルへの書き込みに失敗しました。端末で再試行してください。</p>'
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? '/', `http://127.0.0.1:${port}`);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  let status = 200;
  let body = RESPONSE.ok;

  if (!code) {
    status = 400;
    body = RESPONSE.missing;
  } else if (state !== expectedState) {
    status = 400;
    body = RESPONSE.state;
  } else {
    try {
      writeFileSync(outfile, code, 'utf8');
    } catch (err) {
      console.error('コードの書き込みに失敗しました', err);
      status = 500;
      body = RESPONSE.write;
    }
  }

  res.writeHead(status, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(body);

  if (status === 200) {
    server.close();
  }
});

server.on('error', (err) => {
  console.error('ループバックサーバーの起動に失敗しました', err);
  process.exit(1);
});

server.listen(port, '127.0.0.1');
