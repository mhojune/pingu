import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  base: mode === "production" ? "/pingu/" : "/",
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`,
      },
    },
    // 빌드 시 캐시 무효화
    sourcemap: false,
    // 기본 minifier 사용
    minify: true,
    // 빌드 결과물에 해시 추가
    assetsInlineLimit: 0,
  },
  // 개발 서버 설정
  server: {
    hmr: true,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
        // 백엔드 경로에 /api 프리픽스가 없으므로 제거
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
}));
