import { forwardRef } from 'react'
import { motion } from 'framer-motion'

const PhotoStrip = forwardRef(function PhotoStrip(
  {
    photos = [],
    theme,
    layout = 'strip4',
    pattern = 'dots',
    title = 'Cute Photobox ♡',
    setTitle,
    dateText = '2026.11.09',
    setDateText,
    showTape = true,
    showBarcode = true,
    placedStickers = [],
    onRemoveSticker,
    filter = 'none',
    adjustments = {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      warmth: 0,
      cornerRadius: 4,
      showDateStamp: true,
    },
    effectClass = '',
    onOpenCrop,
    showWatermark = false,
  },
  ref
) {
  const isGrid = layout === 'grid2x2'
  const is3Cut = layout === 'strip3'
  const requiredCount = is3Cut ? 3 : 4
  const displayPhotos = photos.slice(0, requiredCount)

  const getPatternClass = () => {
    switch (pattern) {
      case 'dots':
        return 'pattern-dots'
      case 'checkers':
        return 'pattern-checkers'
      case 'hearts':
        return 'pattern-hearts'
      case 'film':
        return 'pattern-film'
      default:
        return ''
    }
  }

  // Combine selected aesthetic filter with fine-tuned adjustment sliders
  const combinedFilter = [
    filter !== 'none' ? filter : '',
    adjustments?.brightness !== 100 ? `brightness(${adjustments.brightness}%)` : '',
    adjustments?.contrast !== 100 ? `contrast(${adjustments.contrast}%)` : '',
    adjustments?.saturation !== 100 ? `saturate(${adjustments.saturation}%)` : '',
    adjustments?.warmth > 0 ? `sepia(${adjustments.warmth}%)` : '',
  ]
    .filter(Boolean)
    .join(' ') || 'none'

  const cornerRadiusStyle = {
    borderRadius: `${adjustments?.cornerRadius ?? 4}px`,
  }

  return (
    <div className="relative inline-block select-none">
      {/* Washi Tape Header */}
      {showTape && <div className="washi-tape" />}

      {/* Main Strip Container */}
      <div
        ref={ref}
        style={{ backgroundColor: theme.frame, color: theme.text }}
        className={`relative shadow-2xl transition-colors duration-300 overflow-hidden ${
          isGrid
            ? 'w-[340px] p-5 pb-6 rounded-2xl'
            : 'w-[220px] p-4 pb-6 rounded-xl'
        } ${getPatternClass()}`}
      >
        {/* Photos Container */}
        <div
          className={`${
            isGrid
              ? 'grid grid-cols-2 gap-2.5'
              : 'flex flex-col gap-3'
          }`}
        >
          {Array.from({ length: requiredCount }).map((_, i) => {
            const photoSrc = displayPhotos[i]
            return (
              <div
                key={i}
                onClick={() => {
                  if (photoSrc && onOpenCrop) {
                    onOpenCrop(i, photoSrc)
                  }
                }}
                style={cornerRadiusStyle}
                className={`relative overflow-hidden bg-stone-900 shadow-xs border border-black/10 group ${
                  photoSrc && onOpenCrop ? 'cursor-pointer' : ''
                } ${isGrid ? 'aspect-square' : 'aspect-[4/3]'}`}
              >
                {photoSrc ? (
                  <>
                    <img
                      src={photoSrc}
                      alt={`Foto ${i + 1}`}
                      style={{ filter: combinedFilter }}
                      className="w-full h-full object-cover block pointer-events-none"
                    />

                    {/* Aesthetic Visual Effect Overlay */}
                    {effectClass && (
                      <div className={`absolute inset-0 pointer-events-none ${effectClass}`} />
                    )}

                    {/* Sparkles effect overlay */}
                    {effectClass === 'effect-sparkles' && (
                      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                        <span className="absolute top-2 left-2 text-xs select-none drop-shadow-sm">✨</span>
                        <span className="absolute bottom-3 right-10 text-[10px] select-none drop-shadow-sm">⭐</span>
                        <span className="absolute top-1/2 right-2 text-[11px] select-none drop-shadow-sm">✨</span>
                        <span className="absolute bottom-2 left-4 text-[9px] select-none drop-shadow-sm">✦</span>
                      </div>
                    )}

                    {/* Retro Camera Date Stamp (Orange LED 90s Camera) */}
                    {adjustments?.showDateStamp && (
                      <span className="absolute bottom-1.5 right-2 font-mono text-[10px] font-bold tracking-widest text-[#ff6600] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] select-none pointer-events-none z-10">
                        '{dateText ? dateText.slice(2).replace(/[.-]/g, ' ') : '26 11 09'}
                      </span>
                    )}

                    {/* Hover crop indicator */}
                    {onOpenCrop && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-20">
                        <span className="bg-pink-500/90 text-white text-[10px] font-cute font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                          ✂️ Atur Crop
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white/40 bg-stone-800">
                    <span className="text-xl">📸</span>
                    <span className="text-[10px] font-mono mt-1">Slot #{i + 1}</span>
                  </div>
                )}
                {/* Subtle vintage film frame number */}
                <span className="absolute bottom-1 left-1.5 text-[8px] font-mono tracking-tighter text-white/70 bg-black/40 px-1 rounded-xs pointer-events-none z-10">
                  0{i + 1}A
                </span>
              </div>
            )
          })}
        </div>

        {/* Footer Area (Life4Cuts / Photobooth Style) */}
        <div className="mt-4 pt-2 border-t border-black/10 flex flex-col items-center text-center">
          {/* Editable Title */}
          <input
            value={title}
            onChange={e => setTitle && setTitle(e.target.value)}
            style={{ color: theme.accent }}
            placeholder="Ketik judul strip..."
            className="w-full bg-transparent text-center font-script text-xl font-bold tracking-wide outline-none border-b border-transparent hover:border-black/20 focus:border-black/30 transition-colors"
          />

          {/* Date & Subtext */}
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <input
              value={dateText}
              onChange={e => setDateText && setDateText(e.target.value)}
              className="w-24 bg-transparent text-center text-[11px] font-mono uppercase tracking-widest opacity-85 outline-none hover:bg-black/5 focus:bg-white/40 rounded-xs"
              placeholder="YYYY.MM.DD"
            />
            <span className="text-[10px] opacity-40">•</span>
            <span className="text-[10px] font-cute font-bold opacity-75">
              PHOTOBOOTH MEMORY
            </span>
          </div>

          {/* Realistic Barcode / Stamp */}
          {showBarcode && (
            <div className="mt-2.5 flex flex-col items-center opacity-80">
              <div className="flex items-center gap-[2px] h-6 px-2 py-0.5 bg-white/40 rounded-xs">
                {[12, 18, 8, 22, 14, 20, 10, 16, 24, 8, 14, 20, 12, 18, 10, 14, 22, 10, 16, 20].map(
                  (h, idx) => (
                    <div
                      key={idx}
                      style={{ height: `${h}px`, backgroundColor: theme.text }}
                      className={`w-[2px] ${idx % 3 === 0 ? 'w-[3px]' : 'w-[1.5px]'}`}
                    />
                  )
                )}
              </div>
              <span className="text-[8px] font-mono tracking-widest mt-0.5 opacity-60">
                NO. 2026-LIFE-CUTS-77
              </span>
            </div>
          )}

          {/* Freemium Watermark (removable with VIP) */}
          {showWatermark && (
            <div className="mt-2.5 pt-1.5 border-t border-dashed border-black/15 flex flex-col items-center select-none">
              <span className="text-[9px] font-cute font-bold tracking-wider opacity-75">
                📸 Cute Photobox • Free Tier
              </span>
              <span className="text-[7.5px] font-mono tracking-tight opacity-55">
                upgrade to VIP for HD & no watermark
              </span>
            </div>
          )}
        </div>

        {/* Placed Interactive Stickers */}
        {placedStickers.map(stk => (
          <motion.div
            key={stk.instanceId}
            drag
            dragMomentum={false}
            whileHover={{ scale: 1.15, cursor: 'grab' }}
            whileDrag={{ scale: 1.25, cursor: 'grabbing', zIndex: 50 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              position: 'absolute',
              left: `${stk.x}%`,
              top: `${stk.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 30,
            }}
            className="group select-none"
          >
            {stk.type === 'emoji' ? (
              <span className="text-3xl filter drop-shadow-md cursor-grab active:cursor-grabbing block">
                {stk.content}
              </span>
            ) : (
              <span
                style={{ backgroundColor: stk.bg, color: stk.text }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold shadow-md border border-black/10 cursor-grab active:cursor-grabbing block ${
                  stk.font || 'font-cute'
                }`}
              >
                {stk.content}
              </span>
            )}

            {/* Delete button on hover */}
            {onRemoveSticker && (
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation()
                  onRemoveSticker(stk.instanceId)
                }}
                className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm cursor-pointer"
                title="Hapus stiker"
              >
                ✕
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
})

export default PhotoStrip
