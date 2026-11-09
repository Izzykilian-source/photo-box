// --- PREMIUM / FREEMIUM ACCESS CONTROL ---
// Manages VIP state via localStorage. In production, replace with server-side verification.

const VIP_KEY = 'cutephotobox_vip'
const VIP_EXPIRY_KEY = 'cutephotobox_vip_exp'

// Hardcoded VIP codes (for MVP). In production, validate these on a backend.
// The admin gives these codes after confirming QRIS payment.
const VALID_CODES = new Set([
  'CUTEFOTO2026',
  'BESTIE5000',
  'LIFECUTSVIP',
  'PHOTOBOX99',
  'SAYANG5K',
])

export function isVip() {
  try {
    const vip = localStorage.getItem(VIP_KEY)
    const expiry = localStorage.getItem(VIP_EXPIRY_KEY)
    if (vip !== 'true') return false
    if (expiry && Date.now() > parseInt(expiry, 10)) {
      // Expired
      localStorage.removeItem(VIP_KEY)
      localStorage.removeItem(VIP_EXPIRY_KEY)
      return false
    }
    return true
  } catch {
    return false
  }
}

export function activateVip(durationHours = 24) {
  try {
    localStorage.setItem(VIP_KEY, 'true')
    const expiryMs = Date.now() + durationHours * 60 * 60 * 1000
    localStorage.setItem(VIP_EXPIRY_KEY, String(expiryMs))
  } catch {
    // localStorage not available
  }
}

export function deactivateVip() {
  try {
    localStorage.removeItem(VIP_KEY)
    localStorage.removeItem(VIP_EXPIRY_KEY)
  } catch {
    // noop
  }
}

export function validateCode(code) {
  const cleaned = code.trim().toUpperCase()
  if (VALID_CODES.has(cleaned)) {
    activateVip(24) // 24 hours access
    return true
  }
  return false
}

export function getVipExpiry() {
  try {
    const expiry = localStorage.getItem(VIP_EXPIRY_KEY)
    if (!expiry) return null
    return new Date(parseInt(expiry, 10))
  } catch {
    return null
  }
}

export function getVipRemainingText() {
  const exp = getVipExpiry()
  if (!exp) return ''
  const diff = exp.getTime() - Date.now()
  if (diff <= 0) return 'Expired'
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  if (hours > 0) return `${hours}j ${minutes}m tersisa`
  return `${minutes} menit tersisa`
}

// --- TIER DEFINITIONS ---

export const FREE_FILTER_KEYS = [
  'Normal (Jernih)',
  '🌸 Korean Pastel Cream',
  '🤍 Haru B&W',
]

export const FREE_EFFECT_KEYS = ['none']

export const FREE_LAYOUT_KEYS = ['strip3']

export const FREE_STICKER_IDS = [
  'ribbon', 'strawberry', 'cat', 'rabbit',
  'bear', 'tulip', 'sparkles', 'heart_pink',
]

// Free users: no custom text badges, no adjustment sliders, watermarked download
export const VIP_FEATURES = {
  allFilters: true,
  allEffects: true,
  allLayouts: true,
  allStickers: true,
  customBadges: true,
  adjustmentSliders: true,
  hdDownload: true,
  noWatermark: true,
  copyToClipboard: true,
  dateStamp: true,
}

