export default function VisualEffectOverlay({ effectClass = '' }) {
  if (!effectClass) return null

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden z-15 ${effectClass}`}>
      {/* 1. Sparkle Shimmer Extra Visuals */}
      {effectClass === 'effect-sparkles' && (
        <div className="absolute inset-0 pointer-events-none select-none">
          <span className="absolute top-3 left-3 text-lg animate-pulse drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">✨</span>
          <span className="absolute bottom-5 right-4 text-base animate-pulse drop-shadow-[0_0_6px_rgba(255,215,0,0.8)]">⭐</span>
          <span className="absolute top-1/3 right-3 text-sm drop-shadow-[0_0_6px_rgba(255,192,203,0.9)]">✦</span>
          <span className="absolute bottom-3 left-6 text-sm drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">✨</span>
          <span className="absolute top-6 right-1/4 text-xs">✧</span>
          <span className="absolute bottom-1/3 left-3 text-xs">✦</span>
        </div>
      )}

      {/* 2. Heart Bokeh Extra Visuals */}
      {effectClass === 'effect-heart-bokeh' && (
        <div className="absolute inset-0 pointer-events-none select-none">
          <span className="absolute top-4 left-6 text-2xl opacity-75 drop-shadow-[0_0_10px_#ff69b4]">💖</span>
          <span className="absolute bottom-6 right-6 text-3xl opacity-80 drop-shadow-[0_0_12px_#ff1493]">💕</span>
          <span className="absolute top-1/2 left-3 text-xl opacity-60 drop-shadow-[0_0_8px_#ffb6c1]">💗</span>
          <span className="absolute top-3 right-8 text-lg opacity-70 drop-shadow-[0_0_8px_#ff69b4]">💖</span>
          <span className="absolute bottom-1/4 left-1/3 text-sm opacity-50">♡</span>
          <span className="absolute top-1/4 right-1/4 text-sm opacity-55">♡</span>
        </div>
      )}

      {/* 3. 2000s Digicam CCD Flash Flare & Vignette */}
      {effectClass === 'effect-ccd-flash' && (
        <div className="absolute inset-0 pointer-events-none select-none">
          {/* Subtle camera REC timestamp overlay */}
          <div className="absolute bottom-2 left-2 text-[9px] font-mono text-emerald-400 font-bold bg-black/50 px-1.5 py-0.5 rounded tracking-widest opacity-80">
            DIGICAM 5.0MP
          </div>
        </div>
      )}

      {/* 4. Y2K Cyber Glitch Scanlines & Glint */}
      {effectClass === 'effect-y2k-cyber' && (
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute top-2 left-2 text-[8px] font-mono text-cyan-300 font-bold tracking-widest bg-black/60 px-1 rounded">
            //CYBER_2000
          </div>
          <span className="absolute top-3 right-3 text-lg animate-spin" style={{ animationDuration: '6s' }}>🪩</span>
        </div>
      )}

      {/* 5. Light Leak Flare Burst */}
      {effectClass === 'effect-light-leak' && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-400/50 via-rose-500/30 to-transparent rounded-bl-full pointer-events-none" />
      )}

      {/* 6. Rainbow Prism Beam */}
      {effectClass === 'effect-rainbow-prism' && (
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
      )}

      {/* 7. Fairy Dust Bubbles */}
      {effectClass === 'effect-fairy-dust' && (
        <div className="absolute inset-0 pointer-events-none select-none">
          <span className="absolute top-5 left-4 text-base opacity-70">🫧</span>
          <span className="absolute bottom-6 right-5 text-xl opacity-75">🫧</span>
          <span className="absolute top-1/3 right-3 text-sm opacity-60">✨</span>
          <span className="absolute bottom-1/3 left-6 text-sm opacity-50">🫧</span>
        </div>
      )}
    </div>
  )
}
