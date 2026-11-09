import { motion, AnimatePresence } from 'framer-motion'
import VisualEffectOverlay from './VisualEffectOverlay'

export default function Camera({
  videoRef,
  filter,
  count,
  flash,
  error,
  facingMode = 'user',
  onFlipCamera,
  effectClass = '',
}) {
  return (
    <div className="relative mx-auto w-full max-w-md rounded-[2.5rem] border-[10px] border-white/90 bg-stone-900 shadow-2xl overflow-hidden ring-4 ring-pink-200/50">
      {/* Decorative Photobooth Camera Header */}
      <div className="absolute top-3 left-4 z-20 flex items-center gap-2 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/20">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-[11px] font-mono tracking-wider text-white/90 font-medium uppercase">
          {error ? 'CAMERA ERROR' : 'REC • LIVE BOOTH'}
        </span>
      </div>

      {/* Camera Flip Button */}
      {onFlipCamera && !error && (
        <button
          type="button"
          onClick={onFlipCamera}
          className="absolute top-3 right-4 z-20 px-2.5 py-1 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full border border-white/20 text-white text-xs font-cute flex items-center gap-1 transition cursor-pointer"
          title="Ganti kamera depan / belakang"
        >
          <span>🔄</span>
          <span className="text-[11px] font-medium">Putar</span>
        </button>
      )}

      {error ? (
        <div className="p-12 text-center text-rose-200 flex flex-col items-center justify-center min-h-[300px]">
          <span className="text-4xl mb-3">⚠️</span>
          <p className="text-sm font-cute text-lg mb-2">{error}</p>
          <p className="text-xs text-white/70">
            Kamu tetap bisa menggunakan tab <strong>"Unggah Foto"</strong> untuk membuat photostrip!
          </p>
        </div>
      ) : (
        <div className="relative aspect-[4/3] w-full bg-black flex items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            webkit-playsinline="true"
            muted
            style={{
              filter,
              transform: facingMode === 'user' ? 'scaleX(-1)' : 'none',
            }}
            className="w-full h-full object-cover block"
          />

          {/* Aesthetic Visual Effect Overlay on Live Camera */}
          <VisualEffectOverlay effectClass={effectClass} />

          {/* Viewfinder crosshairs */}
          <div className="absolute inset-4 pointer-events-none border border-white/20 rounded-2xl flex items-center justify-center">
            <div className="w-6 h-6 border-t-2 border-l-2 border-white/40 absolute top-2 left-2" />
            <div className="w-6 h-6 border-t-2 border-r-2 border-white/40 absolute top-2 right-2" />
            <div className="w-6 h-6 border-b-2 border-l-2 border-white/40 absolute bottom-2 left-2" />
            <div className="w-6 h-6 border-b-2 border-r-2 border-white/40 absolute bottom-2 right-2" />
          </div>
        </div>
      )}

      {/* Countdown Animation */}
      <AnimatePresence mode="wait">
        {count > 0 && (
          <motion.div
            key={count}
            initial={{ scale: 0.2, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 1.8, opacity: 0, filter: 'blur(4px)' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute inset-0 grid place-items-center z-30 pointer-events-none bg-black/20 backdrop-blur-[1px]"
          >
            <div className="w-28 h-28 rounded-full bg-pink-500/80 border-4 border-white shadow-xl flex items-center justify-center">
              <span className="font-script text-6xl text-white drop-shadow-md">{count}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shutter Flash Animation */}
      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="absolute inset-0 bg-white z-40 pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  )
}
