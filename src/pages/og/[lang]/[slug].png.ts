// journal 文章的分享图:/og/en/<slug>.png、/og/zh/<slug>.png,构建期静态生成。
// 图上的标题取该语言站实际展示的那一份(含回落),与文章页保持一致。
// 仅开发服务下的差异:trailingSlash 为 always 时,Astro 对含动态参数的路由不做扩展名豁免,
// dev 里要访问 /og/en/<slug>.png/ 才有响应;构建产物是普通的 .png 文件,线上地址不带斜杠。
import type { APIRoute, GetStaticPaths } from 'astro';
import { getJournal, type JournalItem, type Lang } from '../../../lib/journal';
import { renderJournalOgImage } from '../../../lib/og-image';

export const getStaticPaths: GetStaticPaths = async () => {
  const langs: Lang[] = ['en', 'zh'];
  const paths = await Promise.all(
    langs.map(async (lang) =>
      (await getJournal(lang)).map((item) => ({ params: { lang, slug: item.slug }, props: { item } })),
    ),
  );
  return paths.flat();
};

export const GET: APIRoute = async ({ props }) => {
  const { post } = (props as { item: JournalItem }).item;
  const png = await renderJournalOgImage({ title: post.data.title, date: post.data.date });
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
