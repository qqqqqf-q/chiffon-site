import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// journal(日志)文章集合。支持中英文文章，默认 zh-CN。
// draft 为 true 的文章不发布到线上页面、sitemap、RSS 与 llms.txt。
const journal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/journal' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    lang: z.enum(['zh-CN', 'en']).default('zh-CN'),
    tags: z.array(z.string()).optional(),
    categories: z.array(z.string()).optional(),
    keywords: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { journal };
