import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { AUTHOR, PROJECTS, SITE_URL, absoluteUrl } from '../config/site';

export const GET: APIRoute = async () => {
  const posts = (await getCollection('journal', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  const lines: string[] = [
    `# ${AUTHOR.displayName}`,
    '',
    `> ${AUTHOR.descriptionEn}`,
    '',
    `- Name / Aliases: ${AUTHOR.alternateNames.join(', ')}`,
    `- Role: ${AUTHOR.jobTitle}`,
    `- Location: ${AUTHOR.location}`,
    `- Affiliation: ${AUTHOR.worksFor.name} (${AUTHOR.worksFor.url})`,
    `- Focus Areas: ${AUTHOR.knowsAbout.join(', ')}`,
    `- Canonical Site: ${SITE_URL}/`,
    '',
    '## Key Pages',
    '',
    `- [Home (English)](${absoluteUrl('/')}): Personal introduction, engineering philosophy, and product design approach.`,
    `- [主页（中文）](${absoluteUrl('/zh/')}): 清凤（Chiffonwind）的中文个人介绍与产品工程理念。`,
    `- [Journal](${absoluteUrl('/journal/')}): Technical essays, LLM benchmarks, and AI agent architecture notes.`,
    `- [RSS Feed](${absoluteUrl('/rss.xml')}): Syndication feed for all published articles.`,
    `- [Full Plain-Text Corpus](${absoluteUrl('/llms-full.txt')}): Complete markdown text of profile, projects, and all journal articles.`,
    '',
    '## Open-Source Projects & Public Work',
    '',
    ...PROJECTS.map((p) => {
      const extra = p.homepage ? ` | Homepage: ${p.homepage}` : '';
      return `- [${p.name}](${p.link}) (${p.role}, ${p.lang}): ${p.desc}${extra}`;
    }),
    '',
    '## Journal Articles',
    '',
    ...posts.map((post) => {
      const slug = post.id.replace(/\.md$/, '');
      const dateStr = post.data.date.toISOString().slice(0, 10);
      return `- [${post.data.title}](${absoluteUrl(`/journal/${slug}/`)}) (${dateStr}): ${post.data.description}`;
    }),
    '',
    '## Profiles & Contact',
    '',
    `- GitHub: https://github.com/qqqqqf-q`,
    `- X (Twitter): https://x.com/qqqqqf_`,
    `- Hugging Face: https://huggingface.co/qqqqqf`,
    `- LinkedIn: https://www.linkedin.com/in/chiffonwind`,
    `- Telegram: https://t.me/chiffoncha`,
    `- WeChat: ${AUTHOR.wechatId}`,
    `- Email: ${AUTHOR.email}`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
