export const themes = {
  strawberry: {
    name: '🍓 Strawberry Milk',
    frame: '#ffe4ec',
    accent: '#ff5c8d',
    text: '#6e2540',
    tagBg: '#ffd0df',
    defaultPattern: 'dots',
  },
  matcha: {
    name: '🍵 Matcha Cloud',
    frame: '#e2f2e5',
    accent: '#4ca36b',
    text: '#285437',
    tagBg: '#cae8cf',
    defaultPattern: 'checkers',
  },
  lavender: {
    name: '💜 Lavender Haze',
    frame: '#eee5ff',
    accent: '#8b5cf6',
    text: '#43297a',
    tagBg: '#ded0ff',
    defaultPattern: 'hearts',
  },
  noir: {
    name: '🖤 Haru Noir',
    frame: '#1e1c24',
    accent: '#e2ddf7',
    text: '#ffffff',
    tagBg: '#322f3b',
    defaultPattern: 'solid',
  },
  vintage: {
    name: '🎞️ 90s Film Roll',
    frame: '#f5ecd9',
    accent: '#b85d18',
    text: '#5c3214',
    tagBg: '#e7d9bf',
    defaultPattern: 'film',
  },
  coquette: {
    name: '🎀 Coquette Bow',
    frame: '#fff0f5',
    accent: '#e64980',
    text: '#6b1d38',
    tagBg: '#ffdbe8',
    defaultPattern: 'hearts',
  },
  cyber: {
    name: '🪩 Y2K Hologram',
    frame: '#e0f2fe',
    accent: '#0284c7',
    text: '#0c4a6e',
    tagBg: '#bae6fd',
    defaultPattern: 'checkers',
  },
  peach: {
    name: '🍑 Peach Sherbet',
    frame: '#ffe7d6',
    accent: '#f97316',
    text: '#7c2d12',
    tagBg: '#fed7aa',
    defaultPattern: 'dots',
  },
  classic: {
    name: '🤍 Minimal White',
    frame: '#ffffff',
    accent: '#374151',
    text: '#111827',
    tagBg: '#f3f4f6',
    defaultPattern: 'solid',
  },
}

export const layouts = {
  strip4: {
    name: '4-Cut Strip (Life4Cuts)',
    shots: 4,
    aspect: 'aspect-[4/3]',
    containerClass: 'w-56 flex-col gap-3',
  },
  strip3: {
    name: '3-Cut Strip (Classic)',
    shots: 3,
    aspect: 'aspect-[4/3]',
    containerClass: 'w-56 flex-col gap-3',
  },
  grid2x2: {
    name: '2x2 Grid (Postcard)',
    shots: 4,
    aspect: 'aspect-square',
    containerClass: 'w-80 grid grid-cols-2 gap-2.5',
  },
}

export const patterns = {
  solid: { name: 'Polos' },
  dots: { name: 'Polka Dots' },
  checkers: { name: 'Gingham Checkers' },
  hearts: { name: 'Mini Hearts' },
  film: { name: 'Film Sprockets' },
}

export const filters = {
  Normal: 'none',
  'Soft Glow': 'brightness(1.05) contrast(0.96) saturate(1.15)',
  'Korean Pink': 'saturate(1.35) hue-rotate(-8deg) contrast(1.03) brightness(1.04)',
  '90s Film': 'sepia(0.35) contrast(1.15) saturate(1.2) brightness(0.98)',
  'Warm Honey': 'sepia(0.2) saturate(1.45) hue-rotate(8deg) brightness(1.05)',
  'Haru B&W': 'grayscale(1) contrast(1.25) brightness(1.02)',
  'Dreamy': 'brightness(1.1) contrast(0.9) saturate(1.3) blur(0.25px)',
  'Cyber Neon': 'contrast(1.2) saturate(1.6) hue-rotate(180deg)',
}

export const stickerLibrary = [
  // Emojis & Cute Animals
  { id: 'ribbon', content: '🎀', type: 'emoji' },
  { id: 'strawberry', content: '🍓', type: 'emoji' },
  { id: 'cat', content: '🐱', type: 'emoji' },
  { id: 'rabbit', content: '🐰', type: 'emoji' },
  { id: 'bear', content: '🧸', type: 'emoji' },
  { id: 'tulip', content: '🌷', type: 'emoji' },
  { id: 'sparkles', content: '✨', type: 'emoji' },
  { id: 'heart_pink', content: '💖', type: 'emoji' },
  { id: 'star_yellow', content: '⭐', type: 'emoji' },
  { id: 'cherry', content: '🍒', type: 'emoji' },
  { id: 'cloud', content: '☁️', type: 'emoji' },
  { id: 'disco', content: '🪩', type: 'emoji' },
  { id: 'bubble', content: '🫧', type: 'emoji' },
  { id: 'clover', content: '🍀', type: 'emoji' },
  { id: 'cake', content: '🍰', type: 'emoji' },
  { id: 'camera', content: '📷', type: 'emoji' },

  // Text Badges & Stamps
  { id: 'txt-life4cuts', content: '인생네컷', type: 'badge', bg: '#ffe4ec', text: '#e64980' },
  { id: 'txt-besties', content: 'BESTIES', type: 'badge', bg: '#e0f2fe', text: '#0284c7' },
  { id: 'txt-xoxo', content: 'XOXO ♡', type: 'badge', bg: '#fdf2f8', text: '#db2777' },
  { id: 'txt-cute', content: 'SO CUTE ✨', type: 'badge', bg: '#fef3c7', text: '#b45309' },
  { id: 'txt-memories', content: 'MEMORIES', type: 'badge', bg: '#f3e8ff', text: '#7e22ce' },
  { id: 'txt-mood', content: 'MOOD', type: 'badge', bg: '#dcfce7', text: '#15803d' },
  { id: 'txt-daebak', content: '대박! 💖', type: 'badge', bg: '#fee2e2', text: '#dc2626' },
  { id: 'txt-vintage-date', content: "'26 11 08", type: 'badge', bg: '#1c1917', text: '#f97316', font: 'font-mono' },
]

export const defaultCaptions = [
  'bestie ✨',
  'so cute 🍓',
  'smile! 🌷',
  'mood 💖',
  'today ♡',
  'sweet day 🎀',
  'memories 🧸',
]
