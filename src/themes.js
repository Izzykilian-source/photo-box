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

// Aesthetic Filters (termasuk Digicam CCD, Teal & Orange, Korean Pastel, Ash Muted, Vintage Karma, Y2K)
export const filters = {
  'Normal (Jernih)': 'none',
  '📸 2000s Digicam CCD': 'contrast(1.22) brightness(1.12) saturate(1.35) sepia(0.12) hue-rotate(-8deg)',
  '🎬 Teal & Orange': 'contrast(1.28) saturate(1.45) sepia(0.22) hue-rotate(-22deg) brightness(1.02)',
  '🌸 Korean Pastel Cream': 'brightness(1.12) contrast(0.92) saturate(1.16) hue-rotate(-6deg)',
  '🌫️ Ash Muted Portrait': 'saturate(0.58) contrast(1.24) brightness(0.95) hue-rotate(185deg) sepia(0.08)',
  '🎞️ Vintage Karma 70s': 'sepia(0.48) contrast(0.95) brightness(1.06) saturate(1.22) hue-rotate(8deg)',
  '🪩 Y2K Webcore Glitch': 'contrast(1.32) saturate(1.7) hue-rotate(165deg) brightness(1.06)',
  '🍓 Strawberry Pop': 'saturate(1.42) hue-rotate(-12deg) contrast(1.05) brightness(1.04)',
  '🍵 Matcha Latte': 'sepia(0.2) saturate(1.22) hue-rotate(25deg) brightness(1.03) contrast(0.98)',
  '🎞️ Disposable 35mm': 'sepia(0.38) contrast(1.18) saturate(1.25) brightness(0.96)',
  '☕ Cafe Sepia': 'sepia(0.55) contrast(1.1) saturate(1.1) brightness(0.98)',
  '🤍 Haru B&W': 'grayscale(1) contrast(1.3) brightness(1.03)',
  '🫧 Ethereal Fairy': 'brightness(1.12) contrast(0.92) saturate(1.25) blur(0.25px)',
  "🧸 Kodak Gold '94": 'sepia(0.25) saturate(1.38) hue-rotate(8deg) contrast(1.12) brightness(1.02)',
  '🎀 Coquette Doll': 'brightness(1.06) contrast(0.98) saturate(1.2) hue-rotate(-10deg)',
  '☀️ Golden Hour': 'sepia(0.32) saturate(1.52) hue-rotate(12deg) brightness(1.08)',
  '🍬 Cotton Candy': 'brightness(1.08) contrast(0.96) saturate(1.35) hue-rotate(-20deg)',
}

// Visual Overlays / Effects
export const aestheticEffects = {
  none: { name: '🚫 Tanpa Efek', class: '' },
  ccd_flash: { name: '📸 Flash Digicam CCD', class: 'effect-ccd-flash' },
  teal_orange: { name: '🎬 Teal & Orange Glow', class: 'effect-teal-orange' },
  y2k_cyber: { name: '🪩 Y2K Cyber Glitch', class: 'effect-y2k-cyber' },
  sparkles: { name: '✨ Sparkle Shimmer', class: 'effect-sparkles' },
  heart_bokeh: { name: '💖 Heart Bokeh', class: 'effect-heart-bokeh' },
  light_leak: { name: '☀️ Light Leak 90s', class: 'effect-light-leak' },
  film_grain: { name: '🎞️ 35mm Grain', class: 'effect-film-grain' },
  rainbow_prism: { name: '🌈 Rainbow Prism', class: 'effect-rainbow-prism' },
  fairy_dust: { name: '🫧 Fairy Dust', class: 'effect-fairy-dust' },
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
  { id: 'butterfly', content: '🦋', type: 'emoji' },
  { id: 'lollipop', content: '🍭', type: 'emoji' },
  { id: 'sparkling_heart', content: '💗', type: 'emoji' },
  { id: 'sparkler', content: '🪄', type: 'emoji' },

  // Text Badges & Stamps
  { id: 'txt-life4cuts', content: '인생네컷', type: 'badge', bg: '#ffe4ec', text: '#e64980' },
  { id: 'txt-besties', content: 'BESTIES', type: 'badge', bg: '#e0f2fe', text: '#0284c7' },
  { id: 'txt-xoxo', content: 'XOXO ♡', type: 'badge', bg: '#fdf2f8', text: '#db2777' },
  { id: 'txt-cute', content: 'SO CUTE ✨', type: 'badge', bg: '#fef3c7', text: '#b45309' },
  { id: 'txt-memories', content: 'MEMORIES', type: 'badge', bg: '#f3e8ff', text: '#7e22ce' },
  { id: 'txt-mood', content: 'MOOD', type: 'badge', bg: '#dcfce7', text: '#15803d' },
  { id: 'txt-daebak', content: '대박! 💖', type: 'badge', bg: '#fee2e2', text: '#dc2626' },
  { id: 'txt-vintage-date', content: "'26 11 09", type: 'badge', bg: '#1c1917', text: '#f97316', font: 'font-mono' },
  { id: 'txt-forever', content: 'FOREVER 🌷', type: 'badge', bg: '#fce7f3', text: '#be185d' },
  { id: 'txt-pure', content: 'PURE LOVE', type: 'badge', bg: '#e0e7ff', text: '#4338ca' },
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
