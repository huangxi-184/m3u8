import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import viteCompression from "vite-plugin-compression"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      algorithm: "gzip",
      threshold: 10240,
      verbose: true, // 是否在控制台中输出压缩结果
      ext: ".gz",
      deleteOriginFile: true, // 源文件压缩后是否删除
    }),
  ],
})
