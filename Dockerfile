FROM node:26.13.1-bookworm

ENV PNPM_HOME=/root/.local/share/pnpm \
    CHOKIDAR_USEPOLLING=1 \
    WATCHPACK_POLLING=true
ENV PATH="$PNPM_HOME:$PATH"

# Node.js 26 には Corepack が同梱されないため、CI と同じ pnpm 11 系を明示導入する。
RUN npm install --global pnpm@11.12.0

WORKDIR /workspace

# 依存キャッシュを構築しつつビルドコンテキストを軽量に保つ
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile && rm -rf node_modules

# 監視ビルドを維持するため、起動時に依存を再インストールして watch ビルドを走らせる
CMD ["bash", "-lc", "pnpm install --frozen-lockfile && pnpm start"]
