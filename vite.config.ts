import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path';
import { applyChannelToDist, type Channel } from './scripts/build-manifest';

/**
 * ビルド成果物 dist/manifest.json をチャンネル別に生成する Vite プラグイン。
 * 通常ビルドと watch(`pnpm start`) の両方で closeBundle 時に走る。
 *
 *   KCW_CHANNEL      dev(既定) | beta | prod
 *   KCW_VERSION      manifest.version（未指定なら package.json の version）
 *   KCW_VERSION_NAME 表示用 version_name（beta の "4.9.0-beta.5" など）
 */
function kcwManifestPlugin(): Plugin {
  const distDir = path.resolve(__dirname, 'dist');
  const srcPublicDir = path.resolve(__dirname, 'src/public');
  return {
    name: 'kcw-manifest',
    closeBundle() {
      applyChannelToDist({
        channel: (process.env.KCW_CHANNEL ?? 'dev') as Channel,
        version: process.env.KCW_VERSION || undefined,
        versionName: process.env.KCW_VERSION_NAME || undefined,
        distDir,
        srcPublicDir,
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), kcwManifestPlugin()],
  root: './src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: [ // Multiple entry points
        path.resolve(__dirname, 'src/page/index.html'),
        path.resolve(__dirname, 'src/background.ts'),
        path.resolve(__dirname, 'src/offscreen/index.html'),
        path.resolve(__dirname, 'src/injection/dmm.ts'),
        path.resolve(__dirname, 'src/injection/dmm.scss'),
        path.resolve(__dirname, 'src/injection/osapi.ts'),
        path.resolve(__dirname, 'src/injection/osapi.scss'),
        // path.resolve(__dirname, 'src/injection/theater.scss'),
        // path.resolve(__dirname, 'src/injection/content-script.ts'),
      ],
      output: {
        entryFileNames: () => {
          // SCSSエントリーポイントの空のJSラッパーを無視
          // または適切な場所に配置する
          return '[name].js';
        },
        assetFileNames: (assetInfo) => {
          // CSSファイルは assets/ ディレクトリに配置
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/[name].[ext]';
          }
          return 'assets/[name].[ext]';
        },
      },
    }, 
  },
})
