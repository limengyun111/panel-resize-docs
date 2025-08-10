import * as path from 'node:path';
import { defineConfig } from 'rspress/config';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  title: 'Panel Resize',
  icon: '/panel-resize.svg',
  themeConfig: {
    prevPageText: '上一页',
    nextPageText: '下一页',
    searchPlaceholderText: '搜索文档',
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/web-infra-dev/rspress',
      },
    ],
  },
  markdown: {
    showLineNumbers: true,
  },
  globalStyles: path.join(__dirname, './docs/index.css')
});
