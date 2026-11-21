// journal 双语路由的唯一数据源。
// 约定:中文原文放 src/content/journal/<slug>.md(lang: zh-CN),
// 英文版放 src/content/journal/en/<slug>.md(lang: en),同一 slug 视为同一篇文章的两种语言。
// 英文站(/journal/)优先展示英文版,没有英文版时回落中文原文并标 fallback;
// 中文站(/zh/journal/)反之。回落页的 canonical 指向原文语言的地址,避免重复内容。
import { getCollection, type CollectionEntry } from 'astro:content';

export type Lang = 'en' | 'zh';
export type JournalPost = CollectionEntry<'journal'>;

export interface JournalItem {
  slug: string;
  /** 当前语言站实际渲染的那一份 */
  post: JournalPost;
  /** 当前语言没有这一篇,展示的是另一种语言的版本 */
  fallback: boolean;
  /** 两种语言都有,可以互相给 hreflang */
  bilingual: boolean;
}

const contentLang = (lang: Lang) => (lang === 'zh' ? 'zh-CN' : 'en');

export const slugOf = (post: JournalPost) => post.id.replace(/\.md$/, '').replace(/^en\//, '');
export const homeHref = (lang: Lang) => (lang === 'zh' ? '/zh/' : '/');
export const journalIndexHref = (lang: Lang) => (lang === 'zh' ? '/zh/journal/' : '/journal/');
export const journalPostHref = (lang: Lang, slug: string) => `${journalIndexHref(lang)}${slug}/`;
// 分享图由 src/pages/og/[lang]/[slug].png.ts 在构建期生成
export const journalOgImageHref = (lang: Lang, slug: string) => `/og/${lang}/${slug}.png`;

export async function getJournal(lang: Lang): Promise<JournalItem[]> {
  const all = await getCollection('journal', ({ data }) => !data.draft);
  const bySlug = new Map<string, Partial<Record<Lang, JournalPost>>>();
  for (const post of all) {
    const slug = slugOf(post);
    const entry = bySlug.get(slug) ?? {};
    entry[post.data.lang === 'en' ? 'en' : 'zh'] = post;
    bySlug.set(slug, entry);
  }
  const other: Lang = lang === 'zh' ? 'en' : 'zh';
  return [...bySlug.entries()]
    .map(([slug, v]) => ({
      slug,
      post: (v[lang] ?? v[other])!,
      fallback: !v[lang],
      bilingual: Boolean(v.en && v.zh),
    }))
    .sort((a, b) => b.post.data.date.valueOf() - a.post.data.date.valueOf());
}

export const isPostLang = (post: JournalPost, lang: Lang) => post.data.lang === contentLang(lang);
