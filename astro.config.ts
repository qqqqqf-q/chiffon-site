import { defineConfig } from 'astro/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sitemap from '@astrojs/sitemap';
import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';

// 站点地图的 lastmod。sitemap 在 astro:build:done 阶段生成,此时页面已写入 dist,
// 这里直接读各文章页自己输出的 article:modified_time,不在配置里另解析一遍 frontmatter 与 slug 规则。
// journal 列表页取其下最新一篇的时间;首页等页面没有可靠的修改时间来源,不写 lastmod——
// 不准确的 lastmod 会让搜索引擎整体不再采信这个字段。
const distDir = fileURLToPath(new URL('./dist/', import.meta.url));
let articleLastmod: Map<string, string> | undefined;

function readArticleLastmod(): Map<string, string> {
  if (articleLastmod) return articleLastmod;
  articleLastmod = new Map();
  for (const entry of fs.readdirSync(distDir, { recursive: true, encoding: 'utf8' })) {
    if (path.basename(entry) !== 'index.html') continue;
    const html = fs.readFileSync(path.join(distDir, entry), 'utf8');
    const modified = html.match(/<meta property="article:modified_time" content="([^"]+)"/)?.[1];
    if (!modified) continue;
    const dir = path.dirname(entry).split(path.sep).join('/');
    articleLastmod.set(`/${dir}/`, modified);
  }
  return articleLastmod;
}

function lastmodFor(pathname: string): string | undefined {
  const articles = readArticleLastmod();
  const own = articles.get(pathname);
  if (own) return own;
  if (!pathname.endsWith('/journal/')) return undefined;
  // 时间均为 toISOString() 的 UTC 格式,字符串序即时间序
  return [...articles].filter(([p]) => p.startsWith(pathname)).map(([, t]) => t).sort().at(-1);
}

export default defineConfig({
  site: 'https://chiffonwind.com',
  trailingSlash: 'always',
  integrations: [
    vue(),
    sitemap({
      filter: (page) => !page.endsWith('/404/') && !page.endsWith('/404.html'),
      serialize(item) {
        const lastmod = lastmodFor(new URL(item.url).pathname);
        return lastmod ? { ...item, lastmod } : item;
      },
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          zh: 'zh-CN',
        },
      },
    }),
  ],
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        // @felinic/ui 内部用 '#' 指代自己的 src（与 Memoh 仓的 vite alias 一致）
        '#': fileURLToPath(new URL('../Memoh/packages/ui/src', import.meta.url)),
      },
    },
  },
});
