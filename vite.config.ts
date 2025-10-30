import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: './src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: [ // Multiple entry points
        path.resolve(__dirname, 'src/page/index.html'),
        path.resolve(__dirname, 'src/background.ts'),
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
