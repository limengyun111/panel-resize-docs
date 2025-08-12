import * as path from 'node:path';
import { defineConfig } from 'rspress/config';

export default defineConfig({
  base: '/panel-resize-docs',
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
        content: 'https://github.com/limengyun111/panel-resize-docs',
      },
    ],
  },
  markdown: {
    showLineNumbers: true,
  },
  globalStyles: path.join(__dirname, './docs/index.css')
});
