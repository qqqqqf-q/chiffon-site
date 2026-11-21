import { AUTHOR, DEFAULT_OG_IMAGE, PROJECTS, SITE_NAME, SITE_URL, absoluteUrl } from '../config/site';

const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export function buildPersonSchema() {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: AUTHOR.name,
    alternateName: [...AUTHOR.alternateNames],
    url: `${SITE_URL}/`,
    image: absoluteUrl('/icon-192.png'),
    jobTitle: AUTHOR.jobTitle,
    description: AUTHOR.descriptionEn,
    homeLocation: {
      '@type': 'Place',
      name: AUTHOR.location,
    },
    worksFor: {
      '@type': 'Organization',
      name: AUTHOR.worksFor.name,
      url: AUTHOR.worksFor.url,
    },
    sameAs: [...AUTHOR.sameAs],
    knowsAbout: [...AUTHOR.knowsAbout],
  };
}

export function buildWebSiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE_NAME,
    alternateName: [AUTHOR.name, AUTHOR.chineseName],
    url: `${SITE_URL}/`,
    inLanguage: ['en', 'zh-CN'],
    author: { '@id': PERSON_ID },
    publisher: { '@id': PERSON_ID },
  };
}

export function buildHomeJsonLd(lang: 'en' | 'zh') {
  const pageUrl = lang === 'zh' ? absoluteUrl('/zh/') : absoluteUrl('/');
  const inLanguage = lang === 'zh' ? 'zh-CN' : 'en';

  const softwareNodes = PROJECTS.map((p) => ({
    '@type': 'SoftwareSourceCode',
    name: p.name,
    description: lang === 'zh' ? p.descZh : p.desc,
    programmingLanguage: p.lang,
    codeRepository: p.link,
    ...(p.homepage ? { url: p.homepage } : {}),
    ...(p.role === 'Creator'
      ? { author: { '@id': PERSON_ID } }
      : { contributor: { '@id': PERSON_ID } }),
  }));

  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildWebSiteSchema(),
      buildPersonSchema(),
      {
        '@type': 'ProfilePage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: lang === 'zh' ? '清凤 (Chiffonwind) — 个人主页' : 'Chiffonwind (清凤) — Personal Site',
        description: lang === 'zh' ? AUTHOR.descriptionZh : AUTHOR.descriptionEn,
        inLanguage,
        isPartOf: { '@id': WEBSITE_ID },
        mainEntity: { '@id': PERSON_ID },
        primaryImageOfPage: absoluteUrl(DEFAULT_OG_IMAGE),
      },
      ...softwareNodes,
    ],
  };
}

export function buildJournalIndexJsonLd(
  posts: Array<{ href: string; title: string; description: string; date: Date; lang: string }>,
  indexPath: string,
) {
  const pageUrl = absoluteUrl(indexPath);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildWebSiteSchema(),
      buildPersonSchema(),
      {
        '@type': 'CollectionPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: `Journal · ${SITE_NAME}`,
        description: 'Technical writing and engineering notes on AI agents, LLMs, and product design by Chiffonwind (清凤).',
        isPartOf: { '@id': WEBSITE_ID },
        author: { '@id': PERSON_ID },
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: posts.map((post, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            url: absoluteUrl(post.href),
            name: post.title,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Journal', item: pageUrl },
        ],
      },
    ],
  };
}

export function buildArticleJsonLd(article: {
  path: string;
  indexPath: string;
  title: string;
  description: string;
  date: Date;
  updatedDate?: Date;
  lang: string;
  wordCount: number;
  tags?: string[];
  keywords?: string[];
  image?: string;
}) {
  const pageUrl = absoluteUrl(article.path);
  const allKeywords = Array.from(new Set([...(article.tags ?? []), ...(article.keywords ?? [])]));

  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildWebSiteSchema(),
      buildPersonSchema(),
      {
        '@type': 'TechArticle',
        '@id': `${pageUrl}#article`,
        mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
        url: pageUrl,
        headline: article.title,
        description: article.description,
        image: absoluteUrl(article.image ?? DEFAULT_OG_IMAGE),
        datePublished: article.date.toISOString(),
        dateModified: (article.updatedDate ?? article.date).toISOString(),
        inLanguage: article.lang,
        wordCount: article.wordCount,
        ...(allKeywords.length > 0 ? { keywords: allKeywords } : {}),
        author: { '@id': PERSON_ID },
        publisher: { '@id': PERSON_ID },
        isPartOf: { '@id': WEBSITE_ID },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Journal', item: absoluteUrl(article.indexPath) },
          { '@type': 'ListItem', position: 3, name: article.title, item: pageUrl },
        ],
      },
    ],
  };
}
