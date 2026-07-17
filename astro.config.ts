import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';

// 个人站（Introducing 页），与旧博客 chiffon-Blog（清凤.fun）相互独立。
// 部署域名未定，确定后在这里补 site 字段以启用 canonical / og:url。
export default defineConfig({
  integrations: [vue()],
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
