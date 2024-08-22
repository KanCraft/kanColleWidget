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
        // path.resolve(__dirname, 'src/injection/dynamic-config.ts'),
        // path.resolve(__dirname, 'src/injection/content-script.ts'),
      ],
      output: {
        entryFileNames: '[name].js', // Remove hash from output file names
        assetFileNames: 'assets/[name].[ext]', // asset file names as well
      },
    }, 
  },
})
