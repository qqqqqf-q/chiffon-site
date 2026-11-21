import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import sitemap from '@astrojs/sitemap';
import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://chiffonwind.com',
  trailingSlash: 'always',
  integrations: [
    vue(),
    sitemap({
      filter: (page) => !page.endsWith('/404/') && !page.endsWith('/404.html'),
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
