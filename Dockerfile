FROM node:22-bookworm

ENV PNPM_HOME=/root/.local/share/pnpm \
    CHOKIDAR_USEPOLLING=1 \
    WATCHPACK_POLLING=true
ENV PATH="$PNPM_HOME:$PATH"

# CI（pnpm/action-setup version: 10）と同じ pnpm 10 系に固定する。未指定だと corepack が最新版を取る
RUN corepack enable pnpm && corepack prepare pnpm@10 --activate

WORKDIR /workspace

# 依存キャッシュを構築しつつビルドコンテキストを軽量に保つ
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile && rm -rf node_modules

# 監視ビルドを維持するため、起動時に依存を再インストールして watch ビルドを走らせる
CMD ["bash", "-lc", "pnpm install --frozen-lockfile && pnpm start"]
