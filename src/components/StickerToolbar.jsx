import { useState } from 'react'
import { motion } from 'framer-motion'
import { stickerLibrary } from '../themes'
import { playPopSound } from '../utils/audio'

const BADGE_COLORS = [
  { bg: '#ffe4ec', text: '#e64980', name: 'Pink' },
  { bg: '#e0f2fe', text: '#0284c7', name: 'Blue' },
  { bg: '#fef3c7', text: '#b45309', name: 'Yellow' },
  { bg: '#dcfce7', text: '#15803d', name: 'Green' },
  { bg: '#f3e8ff', text: '#7e22ce', name: 'Purple' },
  { bg: '#1c1917', text: '#fbbf24', name: 'Noir Gold' },
]

export default function StickerToolbar({ onAddSticker, placedStickers = [], onClearStickers }) {
  const [customText, setCustomText] = useState('')
  const [selectedColorIdx, setSelectedColorIdx] = useState(0)

  const handleAddCustomBadge = e => {
    e.preventDefault()
    const trimmed = customText.trim()
    if (!trimmed) return
    const color = BADGE_COLORS[selectedColorIdx]
    playPopSound()
    onAddSticker({
      id: `custom-${Date.now()}`,
      content: trimmed,
      type: 'badge',
      bg: color.bg,
      text: color.text,
      font: 'font-cute',
    })
    setCustomText('')
  }

  return (
    <div className="bg-white/85 backdrop-blur-md border border-pink-200/80 rounded-3xl p-5 shadow-lg w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-1.5">
          <span className="text-xl">✨</span>
          <h3 className="font-cute font-bold text-xl text-pink-950">Kotak Stiker & Badge Interaktif</h3>
          <span className="text-xs text-pink-600 bg-pink-100/70 px-2 py-0.5 rounded-full font-medium">
            Bisa di-drag di strip foto
          </span>
        </div>

        {placedStickers.length > 0 && (
          <button
            onClick={() => {
              playPopSound()
              onClearStickers()
            }}
            className="text-xs text-rose-500 hover:text-rose-700 underline font-medium cursor-pointer"
          >
            Hapus Stiker ({placedStickers.length})
          </button>
        )}
      </div>

      {/* Stickers Grid / Flex List */}
      <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1 mb-4">
        {stickerLibrary.map(item => {
          if (item.type === 'emoji') {
            return (
              <motion.button
                key={item.id}
                type="button"
                whileHover={{ scale: 1.25, rotate: 6 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  playPopSound()
                  onAddSticker(item)
                }}
                className="w-10 h-10 rounded-2xl bg-pink-50/70 hover:bg-pink-100 flex items-center justify-center text-2xl shadow-xs transition-colors cursor-pointer"
                title={`Tambah ${item.content}`}
              >
                {item.content}
              </motion.button>
            )
          }

          // Preset Badge Sticker
          return (
            <motion.button
              key={item.id}
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                playPopSound()
                onAddSticker(item)
              }}
              style={{ backgroundColor: item.bg, color: item.text }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs border border-black/5 hover:shadow-sm transition cursor-pointer ${
                item.font || 'font-cute tracking-wide'
              }`}
            >
              {item.content}
            </motion.button>
          )
        })}
      </div>

      {/* Custom Text Badge Creator */}
      <form
        onSubmit={handleAddCustomBadge}
        className="pt-3 border-t border-pink-100 flex flex-wrap items-center gap-2"
      >
        <span className="text-xs font-cute font-bold text-stone-700">🏷️ Bikin Stiker Teks Sendiri:</span>
        <input
          type="text"
          value={customText}
          onChange={e => setCustomText(e.target.value)}
          placeholder="cth: Sarah & Dimas ♡"
          maxLength={24}
          className="flex-1 min-w-[150px] px-3 py-1.5 rounded-xl border border-pink-200 bg-pink-50/50 text-xs focus:ring-2 focus:ring-pink-300 outline-none font-cute"
        />

        {/* Color Picker dots */}
        <div className="flex items-center gap-1">
          {BADGE_COLORS.map((c, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedColorIdx(i)}
              style={{ backgroundColor: c.bg, borderColor: c.text }}
              className={`w-5 h-5 rounded-full border-2 transition-transform cursor-pointer ${
                selectedColorIdx === i ? 'scale-125 shadow-xs' : 'opacity-70 hover:opacity-100'
              }`}
              title={c.name}
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={!customText.trim()}
          className="px-3.5 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 disabled:opacity-40 text-white text-xs font-cute font-bold shadow-xs transition cursor-pointer"
        >
          + Tempel
        </button>
      </form>

      <p className="text-[11px] text-stone-500 text-center mt-3">
        💡 <em>Tips: Klik stiker untuk menempelkan ke strip foto, lalu geser (drag) ke posisi mana saja!</em>
      </p>
    </div>
  )
}
