import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { journalPostHref, slugOf } from '../lib/journal';
import { AUTHOR, SITE_NAME, SITE_URL } from '../config/site';

export async function GET(context: APIContext) {
  const posts = (await getCollection('journal', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  return rss({
    title: `${SITE_NAME} · Journal`,
    description: AUTHOR.descriptionEn,
    site: context.site ?? SITE_URL,
    items: posts.map((post) => {
      // 每一份(中文原文/英文版)链接到它自己语言站下的地址
      const href = journalPostHref(post.data.lang === 'en' ? 'en' : 'zh', slugOf(post));
      return {
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.date,
        link: href,
        author: `${AUTHOR.email} (${AUTHOR.displayName})`,
        categories: [...(post.data.categories ?? []), ...(post.data.tags ?? [])],
      };
    }),
    customData: `<language>zh-CN</language>`,
  });
}
