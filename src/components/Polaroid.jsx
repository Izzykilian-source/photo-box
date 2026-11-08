import { motion } from 'framer-motion'
import { useState } from 'react'

export default function Polaroid({ src, index, theme, sticker = '🎀', filter = 'none' }) {
  const [caption, setCaption] = useState(
    ['bestie ✨', 'so cute 🍓', 'smile! 🌷', 'mood 💖', 'favorite moment 💌'][index % 5]
  )
  const tilt = index % 2 === 0 ? -3.5 : 3.5

  return (
    <motion.div
      initial={{ y: -250, opacity: 0, rotate: tilt * 4 }}
      animate={{ y: 0, opacity: 1, rotate: tilt }}
      transition={{ type: 'spring', stiffness: 140, damping: 14, delay: index * 0.12 }}
      whileHover={{ rotate: 0, scale: 1.06, zIndex: 30 }}
      drag
      dragSnapToOrigin
      style={{ backgroundColor: theme.frame }}
      className="relative w-60 p-3.5 pb-14 shadow-2xl rounded-sm cursor-grab active:cursor-grabbing border border-black/5 select-none"
    >
      {/* Tape accent */}
      <div className="washi-tape" style={{ width: '70px', height: '20px', top: '-10px' }} />

      {/* Top sticker badge */}
      <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-3xl select-none filter drop-shadow-sm">
        {sticker}
      </span>

      {/* Photo Frame */}
      <div className="relative aspect-square w-full bg-stone-900 overflow-hidden shadow-inner rounded-xs">
        <img
          src={src}
          alt={`Polaroid ${index + 1}`}
          style={{ filter }}
          className="w-full h-full object-cover block pointer-events-none"
        />
        <span className="absolute bottom-1 right-1 text-[8px] font-mono text-white/50 bg-black/40 px-1 rounded-xs">
          #{index + 1}
        </span>
      </div>

      {/* Handwritten Caption Input */}
      <input
        value={caption}
        onChange={e => setCaption(e.target.value)}
        className="absolute bottom-3.5 inset-x-3 bg-transparent text-center font-script text-xl outline-none hover:bg-black/5 focus:bg-white/40 rounded-sm transition-colors py-0.5"
        style={{ color: theme.accent }}
        placeholder="Tulis pesan..."
      />
    </motion.div>
  )
}
