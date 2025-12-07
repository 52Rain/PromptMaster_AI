import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  
  // 设置 base 属性为 GitHub 仓库名称（子路径）
  const REPO_NAME = 'PromptMaster_AI'; 

  return { // 👈 定义配置对象开始
    base: `/${REPO_NAME}/`, // 部署到 GitHub Pages 必需
    
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    
    plugins: [react()],
    
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  }; // 👈 配置对象结束
});
