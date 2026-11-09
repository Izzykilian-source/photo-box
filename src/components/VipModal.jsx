import { useState } from 'react'
import { motion } from 'framer-motion'
import { validateCode, getVipRemainingText } from '../utils/premium'
import { playPopSound } from '../utils/audio'

const WHATSAPP_NUMBER = '6281234567890' // Ganti dengan nomor WhatsApp admin kamu

export default function VipModal({ isOpen, onClose, onActivated }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  if (!isOpen) return null

  const handleSubmit = e => {
    e.preventDefault()
    setError('')
    if (!code.trim()) {
      setError('Masukkan kode VIP dulu ya!')
      return
    }
    if (validateCode(code)) {
      setSuccess(true)
      playPopSound()
      if (onActivated) onActivated()
    } else {
      setError('Kode tidak valid. Pastikan kode ditulis dengan benar ya!')
    }
  }

  const waMessage = encodeURIComponent(
    `Hai Admin! ✨ Saya sudah bayar VIP Cute Photobox Rp 5.000 via QRIS. Tolong kirimkan kode VIP saya ya! 🎀📸`
  )
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white rounded-[2rem] max-w-md w-full shadow-2xl border-2 border-pink-200 overflow-hidden relative"
      >
        {/* Decorative Header */}
        <div className="bg-gradient-to-br from-pink-400 via-rose-400 to-fuchsia-500 px-6 pt-7 pb-10 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <span className="absolute top-3 left-4 text-2xl">✨</span>
            <span className="absolute top-6 right-8 text-xl">🎀</span>
            <span className="absolute bottom-4 left-12 text-lg">⭐</span>
            <span className="absolute bottom-2 right-4 text-2xl">💖</span>
          </div>

          <div className="text-5xl mb-2 select-none">👑</div>
          <h2 className="font-script text-3xl drop-shadow-sm mb-1">VIP Pass ♡</h2>
          <p className="font-cute text-base text-pink-100">
            Buka semua filter, efek, stiker, dan download tanpa watermark!
          </p>

          {/* Price Tag */}
          <div className="mt-3 inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-2 rounded-full border border-white/30">
            <span className="font-cute text-sm">Cuma</span>
            <span className="font-bold text-2xl font-sans">Rp 5.000</span>
            <span className="font-cute text-sm">/ 24 jam</span>
          </div>
        </div>

        {/* Wavy Separator */}
        <div className="relative h-5 -mt-5">
          <svg viewBox="0 0 400 20" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0,0 C100,20 300,20 400,0 L400,20 L0,20 Z" fill="white" />
          </svg>
        </div>

        <div className="px-6 pb-7">
          {success ? (
            /* ---- SUCCESS STATE ---- */
            <div className="text-center py-6">
              <div className="text-6xl mb-3 select-none">🎉</div>
              <h3 className="font-script text-2xl text-pink-900 mb-2">VIP Aktif!</h3>
              <p className="font-cute text-stone-600 text-sm mb-1">
                Semua fitur premium sudah terbuka untukmu!
              </p>
              <p className="text-xs font-mono text-pink-600 bg-pink-50 px-3 py-1.5 rounded-full inline-block">
                ⏰ {getVipRemainingText()}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-5 w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-cute font-bold text-lg shadow-md hover:shadow-lg transition cursor-pointer"
              >
                Mulai Berkreasi! 🎀
              </button>
            </div>
          ) : (
            /* ---- PURCHASE FLOW ---- */
            <>
              {/* Benefits List */}
              <div className="mb-5">
                <h3 className="font-cute font-bold text-sm text-pink-900 mb-2.5">
                  ✨ Yang kamu dapatkan dengan VIP:
                </h3>
                <div className="grid grid-cols-2 gap-1.5 text-xs font-cute text-stone-700">
                  {[
                    ['🌸', '17 Filter Estetik (CCD, Korea, Vintage, Y2K)'],
                    ['💖', '10 Efek Visual (CCD Flash, Teal/Orange, Bokeh)'],
                    ['📐', 'Semua Layout (4-Cut, 3-Cut, Grid)'],
                    ['🎀', '30+ Stiker & Badge Lucu'],
                    ['🏷️', 'Bikin Stiker Teks Custom Sendiri'],
                    ['🎛️', 'Slider Kecerahan, Kontras, Saturasi'],
                    ['⏰', 'Stempel Tanggal Kamera Retro 90s'],
                    ['💾', 'Download Ultra-HD Tanpa Watermark'],
                  ].map(([icon, text]) => (
                    <div key={text} className="flex items-start gap-1.5 bg-pink-50/60 p-2 rounded-xl border border-pink-100/80">
                      <span className="shrink-0">{icon}</span>
                      <span className="leading-tight">{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Steps */}
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-4 rounded-2xl border border-pink-200/80 mb-5">
                <h4 className="font-cute font-bold text-sm text-pink-900 mb-3">
                  📋 Cara Beli VIP Pass (Super Gampang):
                </h4>
                <ol className="space-y-2.5 text-xs font-cute text-stone-700">
                  <li className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-pink-500 text-white flex items-center justify-center shrink-0 font-bold text-[11px]">1</span>
                    <span>Transfer <strong className="text-pink-700">Rp 5.000</strong> ke QRIS / rekening admin di bawah.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-pink-500 text-white flex items-center justify-center shrink-0 font-bold text-[11px]">2</span>
                    <span>Screenshot bukti transfer, lalu kirim ke <strong className="text-pink-700">WhatsApp Admin</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-pink-500 text-white flex items-center justify-center shrink-0 font-bold text-[11px]">3</span>
                    <span>Admin akan membalas dengan <strong className="text-pink-700">Kode VIP</strong>. Masukkan kode di bawah. Selesai! 🎉</span>
                  </li>
                </ol>

                {/* QRIS Placeholder + WhatsApp Button */}
                <div className="mt-4 flex flex-col items-center gap-3">
                  {/* QRIS Placeholder Box */}
                  <div className="w-44 h-44 bg-white rounded-2xl border-2 border-dashed border-pink-300 flex flex-col items-center justify-center text-center p-3 shadow-inner">
                    <span className="text-3xl mb-1">📱</span>
                    <span className="font-cute font-bold text-xs text-pink-800">QRIS / Rekening</span>
                    <span className="font-mono text-[10px] text-stone-500 mt-1">
                      (Ganti dengan gambar QRIS kamu di sini)
                    </span>
                  </div>

                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#25D366] hover:bg-[#1fb855] text-white font-cute font-bold text-sm shadow-md transition"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    <span>Kirim Bukti ke WhatsApp Admin</span>
                  </a>
                </div>
              </div>

              {/* Code Input */}
              <form onSubmit={handleSubmit}>
                <label className="block font-cute font-bold text-sm text-pink-900 mb-1.5">
                  🔑 Punya Kode VIP? Masukkan di sini:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={code}
                    onChange={e => {
                      setCode(e.target.value.toUpperCase())
                      setError('')
                    }}
                    placeholder="cth: CUTEFOTO2026"
                    maxLength={20}
                    className="flex-1 px-4 py-3 rounded-2xl border-2 border-pink-200 bg-pink-50/50 font-mono text-sm text-center tracking-widest focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none uppercase"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white font-cute font-bold text-sm shadow-md hover:shadow-lg transition cursor-pointer shrink-0"
                  >
                    Aktifkan ✨
                  </button>
                </div>
                {error && (
                  <p className="mt-2 text-xs text-red-600 font-cute font-bold text-center">{error}</p>
                )}
              </form>
            </>
          )}

          {/* Close Button (always visible) */}
          {!success && (
            <button
              type="button"
              onClick={onClose}
              className="mt-4 w-full py-2.5 text-xs font-cute text-stone-500 hover:text-stone-700 transition cursor-pointer text-center"
            >
              Nanti aja, pakai versi gratisnya dulu →
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}

