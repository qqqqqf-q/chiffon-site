// 全站唯一配置源（域名、作者实体、公开项目、社交链接）。
// SEO / JSON-LD / RSS / llms.txt / Footer 全部从此文件读取，避免多处漂移。

export const SITE_URL = 'https://chiffonwind.com';
export const SITE_NAME = 'Chiffonwind (清凤)';
export const DEFAULT_OG_IMAGE = '/og-default.jpg';

export const AUTHOR = {
  name: 'Chiffonwind',
  chineseName: '清凤',
  displayName: 'Chiffonwind (清凤)',
  alternateNames: ['清凤', 'Chiffon', 'Chiffonwind', 'qqqqqf', 'qqqqqf-q'],
  jobTitle: 'Full-Stack & Design Engineer',
  location: 'Shenzhen / Shanghai · Remote',
  worksFor: {
    name: 'Felinic',
    url: 'https://github.com/felinics',
  },
  email: 'qff45688@gmail.com',
  xHandle: '@qqqqqf_',
  wechatId: 'chiffonwind',
  descriptionEn:
    'Chiffonwind (清凤) — Full-stack & design engineer building AI agent systems, developer tools, and interfaces across design and engineering.',
  descriptionZh:
    '清凤（Chiffonwind）的个人主页与技术博客——关注 AI Agent 系统、全栈工程与产品设计。',
  sameAs: [
    'https://github.com/qqqqqf-q',
    'https://x.com/qqqqqf_',
    'https://t.me/chiffoncha',
    'https://huggingface.co/qqqqqf',
    'https://www.linkedin.com/in/chiffonwind',
  ],
  knowsAbout: [
    'AI Agents',
    'Multi-Agent Systems',
    'LLM Engineering',
    'Full-Stack Engineering',
    'Design Engineering',
    'Design Systems',
    'Go',
    'TypeScript',
    'Vue.js',
    'Electron',
    'SQLite',
    'Rust',
  ],
} as const;

export interface ProjectItem {
  name: string;
  desc: string;
  descZh: string;
  lang: string;
  link: string;
  homepage?: string;
  role: 'Creator' | 'Core Contributor';
  featuredInFooter: boolean;
}

export const PROJECTS: ProjectItem[] = [
  {
    name: 'Arkloop',
    desc: 'Open-source local-first personal AI agent platform built with Go, SQLite, Vue, and Electron.',
    descZh: '开源本地优先个人 AI Agent 平台（Go + SQLite + Vue + Electron 单进程架构）。',
    lang: 'Go',
    link: 'https://github.com/qqqqqf-q/Arkloop',
    homepage: 'https://arkloop.io',
    role: 'Creator',
    featuredInFooter: true,
  },
  {
    name: 'Memoh',
    desc: 'Open-source multi-member AI agent platform with containerized workspaces, structured long-term memory, and 12 IM channels.',
    descZh: '开源多成员 AI Agent 平台，具备容器化工作区、结构化长期记忆与多 IM 渠道接入。',
    lang: 'Go',
    link: 'https://github.com/felinics/Memoh',
    homepage: 'https://memoh.ai',
    role: 'Core Contributor',
    featuredInFooter: true,
  },
  {
    name: 'MirrorFlow',
    desc: 'End-to-end pipeline from personal chat history to fine-tuned digital twin LLMs and model distillation.',
    descZh: '从聊天数据到训练闭环的数字分身微调与模型蒸馏工具链。',
    lang: 'Python',
    link: 'https://github.com/qqqqqf-q/MirrorFlow',
    homepage: 'https://qqqqqf-q.github.io/MirrorFlow/',
    role: 'Creator',
    featuredInFooter: true,
  },
  {
    name: 'Oxidarb',
    desc: 'High-frequency Rust triangular arbitrage engine executing in ~10µs per loop.',
    descZh: '基于 Rust 的高频三角套利引擎，单次循环延迟约 10µs。',
    lang: 'Rust',
    link: 'https://github.com/Arkilo-Labs/Oxidarb',
    role: 'Creator',
    featuredInFooter: true,
  },
];

export interface SocialItem {
  name: string;
  href: string;
  handle: string;
  icon: 'github' | 'x' | 'telegram' | 'wechat' | 'mail';
}

export const SOCIALS: SocialItem[] = [
  { name: 'GitHub', href: 'https://github.com/qqqqqf-q', handle: '@qqqqqf-q', icon: 'github' },
  { name: 'X', href: 'https://x.com/qqqqqf_', handle: '@qqqqqf_', icon: 'x' },
  { name: 'Telegram', href: 'https://t.me/chiffoncha', handle: '@chiffoncha', icon: 'telegram' },
  { name: 'WeChat', href: '', handle: 'chiffonwind', icon: 'wechat' },
  { name: 'Email', href: 'mailto:qff45688@gmail.com', handle: 'qff45688@gmail.com', icon: 'mail' },
];

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}
