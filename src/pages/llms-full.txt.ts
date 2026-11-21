import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { AUTHOR, PROJECTS, SITE_URL, absoluteUrl } from '../config/site';

export const GET: APIRoute = async () => {
  const posts = (await getCollection('journal', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  const sections: string[] = [
    `# ${AUTHOR.displayName} — Full Site Text`,
    '',
    `Canonical URL: ${SITE_URL}/`,
    `Aliases: ${AUTHOR.alternateNames.join(', ')}`,
    `Role: ${AUTHOR.jobTitle}`,
    `Location: ${AUTHOR.location}`,
    `Affiliation: ${AUTHOR.worksFor.name} (${AUTHOR.worksFor.url})`,
    `Focus: ${AUTHOR.knowsAbout.join(', ')}`,
    `Profiles: GitHub (https://github.com/qqqqqf-q), X (https://x.com/qqqqqf_), Hugging Face (https://huggingface.co/qqqqqf), LinkedIn (https://www.linkedin.com/in/chiffonwind), Telegram (https://t.me/chiffoncha), Email (${AUTHOR.email})`,
    '',
    '---',
    '',
    '## About',
    '',
    AUTHOR.descriptionEn,
    AUTHOR.descriptionZh,
    '',
    '## Open-Source Projects & Public Work',
    '',
    ...PROJECTS.map((p) => {
      const extra = p.homepage ? `\nHomepage: ${p.homepage}` : '';
      return `### ${p.name} (${p.role} · ${p.lang})\nRepository: ${p.link}${extra}\n${p.desc}\n${p.descZh}\n`;
    }),
    '---',
    '',
    '## Journal Articles (Full Text)',
    '',
    ...posts.map((post) => {
      const slug = post.id.replace(/\.md$/, '');
      const dateStr = post.data.date.toISOString().slice(0, 10);
      const tags = post.data.tags?.join(', ') ?? '';
      return [
        `### ${post.data.title}`,
        `URL: ${absoluteUrl(`/journal/${slug}/`)}`,
        `Date: ${dateStr}`,
        `Language: ${post.data.lang}`,
        ...(tags ? [`Tags: ${tags}`] : []),
        `Summary: ${post.data.description}`,
        '',
        (post.body ?? '').trim(),
        '',
        '---',
        '',
      ].join('\n');
    }),
  ];

  return new Response(sections.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
