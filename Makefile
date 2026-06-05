project = 艦これウィジェット
dev_image := kcw-dev

ENGINE ?= docker # or ENGINE=podman make dev

# ANSI Color
# 0: Black, 1: Red, 2: Green, 3: Yellow, 4: Blue, 5: Magenta, 6: Cyan, 7: White
dev:
	@echo "\033[0;33m[dev]\tDocker イメージ $(dev_image) をビルドします\033[0m"
	@echo "\033[0;33m[dev]\t現在のディレクトリ: $(CURDIR)\033[0m"
	@echo "\033[0;33m[dev]\t使用するコンテナエンジン: $(ENGINE)\033[0m"
	${ENGINE} build -t $(dev_image) .
	@echo "\033[0;33m[dev]\twatch ビルドをコンテナで起動します (Ctrl+C で終了)\033[0m"
	${ENGINE} run --rm -it \
		-v "$(CURDIR)":/workspace \
		-v kcw-node-modules:/workspace/node_modules \
		$(dev_image)

clean:
	@echo "\033[0;33m[clean]\t既存ビルドファイルを削除します\033[0m"
	rm -rf dist
	rm -rf release

# package は dist/ を Chrome Webstore 用の zip にパッケージするだけのタスクです。
#
# チャンネル別の差分（name の接尾辞・アイコン・version/version_name）は、
# ビルド時に Vite プラグイン(scripts/build-manifest.ts)が dist へ反映済みなので、
# ここでは zip するだけ。旧 release / beta-release のような切替ロジックは持ちません。
#
# 前提: 先に `KCW_CHANNEL=beta|prod KCW_VERSION=... pnpm build && pnpm run remove-remote-code`
#       でチャンネル別の dist を作っておくこと。
# 注意: manifest.json が zip のルートに来るよう、dist の「中身」を zip します。
package:
	@echo "\033[0;33m[package]\tdist/ を zip にパッケージします\033[0m"
	mkdir -p release
	rm -f release/$(project).zip
	cd dist && zip -qr ../release/$(project).zip . -x '*.template.json' '*.DS_Store' '__MACOSX/*'
	@echo "\n\033[0;32m[SUCCESSFULLY PACKAGED]\033[0m release/$(project).zip\n"

# version はリリースの「単一の管理コマンド」です。
#   1. package.json の version を更新（version の唯一の真実源）
#   2. src/release-note.json の未公開エントリを git 履歴から再生成
# 使い方:  make version v=4.9.0
version:
	@if [ -z "$(v)" ]; then echo "\033[0;31m[ERROR]\033[0m usage: make version v=X.Y.Z"; exit 1; fi
	@jq ".version = \"$(v)\"" package.json > package.json.tmp && mv package.json.tmp package.json
	@echo "\033[0;32m[UPDATED]\033[0m package.json version => $(v)"
	@pnpm run release-note
	@echo "\033[0;36m[NEXT]\033[0m src/release-note.json の message を編集 → commit & push すると BETA が自動公開されます"
	@echo "\033[0;36m[NEXT]\033[0m 本番公開は: gh release create v$(v) --generate-notes"

token:
	bash ./scripts/retrieve-token.sh
