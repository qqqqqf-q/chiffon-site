// journal 文章分享图(1200×630 PNG)的构建期渲染。
// 版式与文章列表的纸面卡片同源:页面底色 + 字标 + 标题 + 日期,文字用站点的展示字体 MiSans。
//
// 字体来源与约束:
// - misans-vf 只提供按 unicode-range 切分的 woff2 分块,satori 不读 woff2,
//   所以按标题实际用到的字符挑出分块,解压成 ttf 再交给 satori。
// - satori 不处理可变字体的轴,只画默认实例(MiSans 的常规字重),因此图上没有粗细层级。
// - 同名同字重的多份字体在 satori 里会互相覆盖,每个分块必须用独立的 family 名,
//   再按顺序写进 fontFamily 做逐字回落。
// - MiSans 的分块不含弯引号(U+2018/2019)等少数字符,末位用 Inter 兜底。
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import satori from 'satori';
import sharp from 'sharp';
import wawoff2 from 'wawoff2';

// 构建产物里的 import.meta.url 不再指向源码目录,依赖路径一律从项目根解析。
const require = createRequire(path.join(process.cwd(), 'package.json'));
const misansCssPath = require.resolve('misans-vf');
const interFallbackPath = path.join(
  path.dirname(require.resolve('@fontsource/inter/package.json')),
  'files/inter-latin-400-normal.woff',
);

interface FontChunk {
  file: string;
  ranges: Array<[number, number]>;
}

let chunkIndex: FontChunk[] | undefined;
const ttfCache = new Map<string, Promise<Buffer>>();

function loadChunkIndex(): FontChunk[] {
  if (chunkIndex) return chunkIndex;
  const css = fs.readFileSync(misansCssPath, 'utf8');
  const dir = path.dirname(misansCssPath);
  chunkIndex = [...css.matchAll(/@font-face\{[^}]*?url\(["']?([^"')]+)["']?\)[^}]*?unicode-range:([^;}]+)/g)].map(
    (m) => ({
      file: path.join(dir, m[1]),
      ranges: m[2].split(',').map((range): [number, number] => {
        const [start, end] = range.trim().replace(/^U\+/i, '').split('-');
        return [parseInt(start, 16), parseInt(end ?? start, 16)];
      }),
    }),
  );
  return chunkIndex;
}

function decompress(file: string): Promise<Buffer> {
  let pending = ttfCache.get(file);
  if (!pending) {
    pending = wawoff2.decompress(fs.readFileSync(file)).then((ttf: Uint8Array) => Buffer.from(ttf));
    ttfCache.set(file, pending);
  }
  return pending;
}

async function fontsFor(text: string) {
  const files = new Set<string>();
  for (const ch of text) {
    const cp = ch.codePointAt(0)!;
    const chunk = loadChunkIndex().find((c) => c.ranges.some(([a, b]) => cp >= a && cp <= b));
    if (chunk) files.add(chunk.file);
  }
  const fonts: Array<{ name: string; data: Buffer; weight: 400; style: 'normal' }> = [];
  // 逐个解压:wawoff2 的 wasm 实例共用一块内存,并发调用会互相写坏输出。
  for (const file of files) {
    fonts.push({ name: `misans-${fonts.length}`, data: await decompress(file), weight: 400, style: 'normal' });
  }
  fonts.push({ name: 'inter-fallback', data: fs.readFileSync(interFallbackPath), weight: 400, style: 'normal' });
  return fonts;
}

const WORDMARK = 'CHIFFON';

export async function renderJournalOgImage(post: { title: string; date: Date }): Promise<Buffer> {
  // 与文章页的日期格式一致;锁 UTC 的原因同页面(frontmatter 纯日期按 UTC 午夜解析)。
  const dateLabel = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(post.date);
  const footer = `Journal · ${dateLabel}`;
  const fonts = await fontsFor(`${WORDMARK}${post.title}${footer}`);

  // 颜色取自 global.css 的浅色 token:页面底色 / heading / tertiary。
  // 外层只铺底色,内层用固定宽高加 margin 留边:satori 的尺寸按 content-box 计,
  // 在同一个盒子上同时写 100% 和 padding 会把内容撑出画布。
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: { display: 'flex', width: 1200, height: 630, background: '#F5F4F1' },
        children: {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              width: 1040,
              height: 486,
              margin: '72px 80px',
              fontFamily: fonts.map((f) => f.name).join(', '),
              color: '#0f0f0d',
            },
            children: [
              { type: 'div', props: { style: { fontSize: 30, letterSpacing: 1.5 }, children: WORDMARK } },
              {
                type: 'div',
                props: {
                  style: { display: 'flex', fontSize: 66, lineHeight: 1.22, letterSpacing: -1 },
                  children: post.title,
                },
              },
              { type: 'div', props: { style: { fontSize: 26, color: '#6B6560' }, children: footer } },
            ],
          },
        },
      },
    },
    { width: 1200, height: 630, fonts },
  );

  return sharp(Buffer.from(svg)).png().toBuffer();
}
