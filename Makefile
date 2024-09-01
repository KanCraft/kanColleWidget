project = 艦これウィジェット

clean:
	rm -rf release

# 公開版リリース用のzipを作成します
# 基本的に GitHub Actions が叩くため、手動で実行することはありません
release: clean
	@mkdir -p release
	@pnpm run build
	@mv dist/icons/prod/*.png dist/icons/
	@rm -rf dist/icons/beta dist/icons/prod
	@cp -r dist release/$(project)
	@zip -r release/$(project).zip release/$(project)/*
	@echo "\n\033[0;32m[SUCCESSFULLY PACKAGED]\033[0m release/$(project).zip\n"

# ベータリリース用のzipを作成します
# 基本的に GitHub Actions が叩くため、手動で実行することはありません
# 公開版との違いは、アイコンが beta フォルダに配置されることと、manifest.json の name に(BETA)が追加されることだけです
beta-release: clean
	@mkdir -p release
	@pnpm run build
	@mv dist/icons/beta/*.png dist/icons/
	@rm -rf dist/icons/beta dist/icons/prod
	@sed "s/\"$(project)\"/\"$(project) (BETA)\"/" src/public/manifest.json > dist/manifest.json
	@cp -r dist release/$(project)-beta
	@zip -r release/$(project)-beta.zip release/$(project)-beta/*
	@echo "\n\033[0;32m[SUCCESSFULLY PACKAGED]\033[0m release/$(project)-beta.zip\n"

# draft はリリースノートの下書きを行うためのタスクです
# 直近のタグから現在までのコミットは、ベータリリースすべき内容としてリリースノートに記載されます
# タグが更新されない間のコミットは、最新のリリースエントリを更新しながら累積されていきますが、その場合もベータリリースのためにバージョンは更新されます
# 累積は、ひとたびタグが打たれたら（=公開版がリリースされたら）終了し、次の make draft からは新しいリリースエントリが作成されます
date := $(shell date '+%Y-%m-%d')
pkgv := $(shell jq -r .version package.json)
manv := $(shell jq -r .version src/public/manifest.json)
relv := $(shell jq -r .releases[0].version src/release-note.json)
last := $(shell git describe --tags --abbrev=0)
commits_since_last_tag := $(shell git log $(last)..HEAD --no-merges --pretty="{\\\"title\\\": \\\"%s\\\", \\\"hash\\\":\\\"%H\\\"}" | grep -v 'bot' | head -30 | sed '$$!s/$$/,/')
1st_commit_of_note := $(shell jq --raw-output ".releases[0].commits[-1].hash" src/release-note.json)
1st_commit_of_logs := $(shell git log $(last)..HEAD --no-merges --reverse --pretty="%H" | head -1)
last_message_of_note := $(shell jq --raw-output ".releases[0].message" src/release-note.json)
draft:
	##################################################
	# 先に package.json のバージョンを変更してください
	#   packages.json     	 $(pkgv)
	#   manifest.json     	 $(manv)
	#   release-note.json	$(relv)
	##################################################
	@if [ $(pkgv) = $(manv) ]; then echo "\033[0;31m[ERROR]\033[0m package.json と manifest.json のバージョンが同じです"; exit 1; fi
	@jq ".version = \"$(pkgv)\"" src/public/manifest.json > src/public/manifest.json.tmp
	@echo "\033[0;32m[UPDATED]\033[0m manifest.json\t\t $(manv) =>  $(pkgv)"
	@mv src/public/manifest.json.tmp src/public/manifest.json
	@jq ".releases |= [{\"date\":\"$(date)\",\"version\":\"v$(pkgv)\",\"message\":\"\",\"commits\":[$(commits_since_last_tag)]}] + ." src/release-note.json > src/release-note.json.tmp
	@echo "\033[0;38m[INFO]\033[0m First commit of logs: $(1st_commit_of_logs)"
	@echo "\033[0;38m[INFO]\033[0m First commit of note: $(1st_commit_of_note)"
	@if [ $(1st_commit_of_logs) == $(1st_commit_of_note) ]; then \
		echo "\033[0;33m[WARNING]\033[0m 未公開BETAバージョンの追加更新のため、リリースノートの修正を行います"; \
		jq "del(.releases[1])" src/release-note.json.tmp | jq ".releases[0].message = \"$(last_message_of_note)\"" > src/release-note.json; \
		rm src/release-note.json.tmp; \
	else \
		mv src/release-note.json.tmp src/release-note.json; \
	fi;
	@echo "\033[0;32m[UPDATED]\033[0m release-note.json\t$(relv) => v$(pkgv)"
	##################################################
	@echo "\033[0;36m[PLEASE EDIT]\033[0m "`pwd`/src/release-note.json
