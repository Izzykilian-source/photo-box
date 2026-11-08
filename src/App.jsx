import { useRef, useState } from 'react'
import { toPng, toBlob } from 'html-to-image'
import { motion } from 'framer-motion'
import useCamera from './hooks/useCamera'
import Camera from './components/Camera'
import PhotoUploader from './components/PhotoUploader'
import Polaroid from './components/Polaroid'
import PhotoStrip from './components/PhotoStrip'
import StickerToolbar from './components/StickerToolbar'
import Sparkles from './components/Sparkles'
import CropModal from './components/CropModal'
import { themes, layouts, patterns, filters } from './themes'
import { playShutterSound, playBeepSound, playPopSound } from './utils/audio'

const wait = ms => new Promise(r => setTimeout(r, ms))

export default function App() {
  const { videoRef, capture, error, facingMode, flipCamera } = useCamera()
  const stripRef = useRef(null)

  // Core States
  const [photos, setPhotos] = useState([])
  const [count, setCount] = useState(0)
  const [flash, setFlash] = useState(false)
  const [busy, setBusy] = useState(false)
  const [mode, setMode] = useState('camera') // 'camera' | 'upload'
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [timerSeconds, setTimerSeconds] = useState(3) // 3 | 5 | 10

  // Cropping Tool States
  const [cropModalOpen, setCropModalOpen] = useState(false)
  const [cropTargetIndex, setCropTargetIndex] = useState(null)
  const [cropImageSrc, setCropImageSrc] = useState(null)

  // Styling & Design Variety States
  const [themeKey, setThemeKey] = useState('strawberry')
  const [layoutKey, setLayoutKey] = useState('strip4')
  const [patternKey, setPatternKey] = useState('dots')
  const [filterKey, setFilterKey] = useState('Korean Pink')
  const [stripTitle, setStripTitle] = useState('Cute Photobox ♡')
  const [dateText, setDateText] = useState('2026.11.08')
  const [showTape, setShowTape] = useState(true)
  const [showBarcode, setShowBarcode] = useState(true)
  const [placedStickers, setPlacedStickers] = useState([])
  const [isExporting, setIsExporting] = useState(false)
  const [copiedToast, setCopiedToast] = useState(false)

  const theme = themes[themeKey]
  const layout = layouts[layoutKey]
  const filter = filters[filterKey]
  const cropAspectRatio = layoutKey === 'grid2x2' ? 1 : 4 / 3

  // Handle Theme Change
  const handleThemeChange = newThemeKey => {
    setThemeKey(newThemeKey)
    if (themes[newThemeKey].defaultPattern) {
      setPatternKey(themes[newThemeKey].defaultPattern)
    }
    if (soundEnabled) playPopSound()
  }

  // Open Crop Modal for a specific photo slot
  const handleOpenCrop = (index, imageSrc) => {
    const targetSrc = imageSrc || photos[index]
    if (!targetSrc) return
    setCropTargetIndex(index)
    setCropImageSrc(targetSrc)
    setCropModalOpen(true)
  }

  // Save Cropped Image
  const handleSaveCrop = croppedDataUrl => {
    if (cropTargetIndex !== null) {
      setPhotos(prev => {
        const next = [...prev]
        next[cropTargetIndex] = croppedDataUrl
        return next
      })
    }
  }

  // Camera Capture Sequence
  const startCameraCapture = async () => {
    if (busy || error) return
    setBusy(true)
    setPhotos([])
    const totalShots = layout.shots

    for (let i = 0; i < totalShots; i++) {
      // Countdown based on timerSeconds
      for (let n = timerSeconds; n > 0; n--) {
        setCount(n)
        if (soundEnabled) playBeepSound(520, 0.08)
        await wait(1000)
      }
      setCount(0)

      // Shutter flash & sound
      setFlash(true)
      if (soundEnabled) playShutterSound()
      const shot = capture(filter)
      if (shot) {
        setPhotos(prev => [...prev, shot])
      }

      await wait(350)
      setFlash(false)
      await wait(450)
    }

    setBusy(false)
    if (soundEnabled) playPopSound()
  }

  // Add Interactive Sticker to Photostrip
  const handleAddSticker = stickerItem => {
    const newSticker = {
      ...stickerItem,
      instanceId: `${stickerItem.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      x: 30 + Math.floor(Math.random() * 40),
      y: 20 + Math.floor(Math.random() * 60),
    }
    setPlacedStickers(prev => [...prev, newSticker])
  }

  // Remove Individual Sticker
  const handleRemoveSticker = instanceId => {
    if (soundEnabled) playPopSound()
    setPlacedStickers(prev => prev.filter(s => s.instanceId !== instanceId))
  }

  // Download Photostrip as High-Res PNG
  const downloadStrip = async () => {
    if (!stripRef.current || photos.length === 0) return
    setIsExporting(true)
    if (soundEnabled) playPopSound()

    try {
      await wait(100)
      const dataUrl = await toPng(stripRef.current, {
        pixelRatio: 3,
        cacheBust: true,
      })
      const link = document.createElement('a')
      link.download = `photobox-${themeKey}-${Date.now()}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Download gagal:', err)
      alert('Gagal mengunduh foto strip. Silakan coba lagi!')
    } finally {
      setIsExporting(false)
    }
  }

  // Copy Photostrip Directly to Clipboard
  const copyToClipboard = async () => {
    if (!stripRef.current || photos.length === 0) return
    setIsExporting(true)
    if (soundEnabled) playPopSound()

    try {
      await wait(100)
      const blob = await toBlob(stripRef.current, { pixelRatio: 2.5 })
      if (!blob) throw new Error('Blob conversion failed')

      if (navigator?.clipboard?.write) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ])
        setCopiedToast(true)
        setTimeout(() => setCopiedToast(false), 2500)
      } else {
        alert('Fitur salin clipboard belum didukung di browser ini.')
      }
    } catch (err) {
      console.error('Salin ke clipboard gagal:', err)
      alert('Gagal menyalin gambar ke clipboard.')
    } finally {
      setIsExporting(false)
    }
  }

  // Print Photostrip
  const handlePrint = () => {
    if (soundEnabled) playPopSound()
    window.print()
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden font-sans pb-20">
      {/* Background Sparkles & Ambient Deco */}
      <Sparkles />

      {/* Interactive Crop Modal */}
      {cropModalOpen && (
        <CropModal
          key={`${cropTargetIndex}-${cropImageSrc}`}
          isOpen={cropModalOpen}
          imageSrc={cropImageSrc}
          aspectRatio={cropAspectRatio}
          onSave={handleSaveCrop}
          onClose={() => setCropModalOpen(false)}
        />
      )}

      <main className="max-w-4xl mx-auto px-4 pt-8 text-center relative z-10">
        {/* Header Section */}
        <header className="mb-6">
          <div className="flex items-center justify-between mb-2 max-w-lg mx-auto">
            <span className="text-xs bg-pink-100/90 text-pink-700 px-3 py-1 rounded-full font-cute font-bold shadow-xs">
              ✨ KOREAN PHOTOBOOTH STUDIO
            </span>
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled)
                if (!soundEnabled) playPopSound()
              }}
              className="text-xs bg-white/80 hover:bg-white text-stone-700 px-3 py-1 rounded-full shadow-xs border border-pink-200 flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>{soundEnabled ? '🔊 Suara Aktif' : '🔇 Mute'}</span>
            </button>
          </div>

          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-script text-5xl md:text-6xl text-pink-900 tracking-tight drop-shadow-sm mb-1"
          >
            📸 Cute Photobox
          </motion.h1>
          <p className="font-cute text-stone-600 text-base md:text-lg">
            Abadikan momen estetik ala Life4Cuts • Desain frame beragam & bisa unggah foto!
          </p>
        </header>

        {/* Mode Switcher Tabs */}
        <div className="flex justify-center mb-6">
          <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-full shadow-md border border-pink-200/80 inline-flex gap-1">
            <button
              onClick={() => {
                setMode('camera')
                if (soundEnabled) playPopSound()
              }}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                mode === 'camera'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-xs'
                  : 'text-stone-600 hover:text-pink-600'
              }`}
            >
              📷 Kamera Langsung
            </button>
            <button
              onClick={() => {
                setMode('upload')
                if (soundEnabled) playPopSound()
              }}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                mode === 'upload'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-xs'
                  : 'text-stone-600 hover:text-pink-600'
              }`}
            >
              📁 Unggah Foto Sendiri
            </button>
          </div>
        </div>

        {/* Input Area: Live Camera or Upload Mode */}
        <section className="mb-8">
          {mode === 'camera' ? (
            <div>
              <Camera
                videoRef={videoRef}
                filter={filter}
                count={count}
                flash={flash}
                error={error}
                facingMode={facingMode}
                onFlipCamera={flipCamera}
              />

              {/* Camera Controls & Timer Selector */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <div className="bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-pink-200 shadow-xs flex items-center gap-1.5 text-xs font-cute text-stone-700">
                  <span>⏱️ Timer:</span>
                  {[3, 5, 10].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setTimerSeconds(s)
                        if (soundEnabled) playPopSound()
                      }}
                      className={`px-2 py-0.5 rounded-full font-bold transition cursor-pointer ${
                        timerSeconds === s
                          ? 'bg-pink-500 text-white'
                          : 'hover:bg-pink-100 text-stone-600'
                      }`}
                    >
                      {s}s
                    </button>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startCameraCapture}
                  disabled={busy || !!error}
                  className="rounded-full px-8 py-3.5 bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 text-white font-cute font-bold text-xl shadow-[0_6px_0_#d84a75] hover:shadow-[0_4px_0_#d84a75] hover:translate-y-[2px] active:translate-y-[6px] active:shadow-none disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>{busy ? 'Sedang Memotret...' : `Mulai Foto (${layout.shots}x)! 🎀`}</span>
                </motion.button>
              </div>
            </div>
          ) : (
            <PhotoUploader
              photos={photos}
              setPhotos={setPhotos}
              maxShots={layout.shots}
              filter={filter}
              onOpenCrop={handleOpenCrop}
            />
          )}
        </section>

        {/* Design Customization Station (Desain Beragam) */}
        <section className="bg-white/80 backdrop-blur-md rounded-3xl p-5 shadow-lg border border-pink-200/80 mb-8 max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-pink-100">
            <h2 className="font-cute font-bold text-xl text-pink-950 flex items-center gap-2">
              <span>🎨</span> Desain & Kustomisasi Photobox
            </h2>
            <span className="text-xs text-stone-500 font-medium">Bebas pilih tema & motif</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-left">
            {/* Theme Selector */}
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                🌸 Tema Warna Frame
              </label>
              <select
                value={themeKey}
                onChange={e => handleThemeChange(e.target.value)}
                className="w-full rounded-xl px-3 py-2 bg-pink-50/80 border border-pink-200 text-xs font-medium focus:ring-2 focus:ring-pink-300 outline-none shadow-xs cursor-pointer"
              >
                {Object.entries(themes).map(([k, t]) => (
                  <option key={k} value={k}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Layout Selector */}
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                📐 Format Layout
              </label>
              <select
                value={layoutKey}
                onChange={e => {
                  setLayoutKey(e.target.value)
                  if (soundEnabled) playPopSound()
                }}
                className="w-full rounded-xl px-3 py-2 bg-pink-50/80 border border-pink-200 text-xs font-medium focus:ring-2 focus:ring-pink-300 outline-none shadow-xs cursor-pointer"
              >
                {Object.entries(layouts).map(([k, l]) => (
                  <option key={k} value={k}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Pattern Selector */}
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                ✨ Pola / Motif Frame
              </label>
              <select
                value={patternKey}
                onChange={e => {
                  setPatternKey(e.target.value)
                  if (soundEnabled) playPopSound()
                }}
                className="w-full rounded-xl px-3 py-2 bg-pink-50/80 border border-pink-200 text-xs font-medium focus:ring-2 focus:ring-pink-300 outline-none shadow-xs cursor-pointer"
              >
                {Object.entries(patterns).map(([k, p]) => (
                  <option key={k} value={k}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Selector */}
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                📸 Filter Estetik
              </label>
              <select
                value={filterKey}
                onChange={e => {
                  setFilterKey(e.target.value)
                  if (soundEnabled) playPopSound()
                }}
                className="w-full rounded-xl px-3 py-2 bg-pink-50/80 border border-pink-200 text-xs font-medium focus:ring-2 focus:ring-pink-300 outline-none shadow-xs cursor-pointer"
              >
                {Object.keys(filters).map(f => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Toggles: Washi Tape & Barcode & Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-pink-100/70 text-xs text-stone-600">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showTape}
                  onChange={e => setShowTape(e.target.checked)}
                  className="accent-pink-500 rounded"
                />
                <span>Tape Selotip Atas</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showBarcode}
                  onChange={e => setShowBarcode(e.target.checked)}
                  className="accent-pink-500 rounded"
                />
                <span>Barcode & No. Cetak</span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-cute text-stone-500">Tanggal:</span>
              <input
                type="text"
                value={dateText}
                onChange={e => setDateText(e.target.value)}
                placeholder="Tanggal"
                className="w-24 px-2 py-1 text-center bg-white border border-pink-200 rounded-lg text-xs font-mono"
              />
            </div>
          </div>
        </section>

        {/* Results & Customization Section */}
        {photos.length > 0 && (
          <section className="mt-8">
            {/* Quick Crop Selector Bar */}
            <div className="mb-6 flex flex-wrap items-center justify-center gap-2 bg-white/70 backdrop-blur-md p-3 rounded-2xl border border-pink-200 shadow-xs max-w-xl mx-auto">
              <span className="text-xs font-cute font-bold text-stone-700 flex items-center gap-1">
                ✂️ Atur Posisi / Crop:
              </span>
              {photos.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleOpenCrop(i)}
                  className="px-3 py-1 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-700 text-xs font-cute font-bold transition cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  Foto #{i + 1}
                </button>
              ))}
            </div>

            {/* Sticker Drawer */}
            <div className="mb-8">
              <StickerToolbar
                onAddSticker={handleAddSticker}
                placedStickers={placedStickers}
                onClearStickers={() => setPlacedStickers([])}
              />
            </div>

            {/* Photostrip & Action Controls */}
            <div className="flex flex-col items-center justify-center my-6">
              <h2 className="font-script text-4xl text-pink-900 mb-2">
                Hasil Photostrip Kamu ♡
              </h2>
              <p className="text-xs text-stone-500 mb-6">
                💡 <em>Klik langsung pada foto di dalam strip untuk crop/atur posisi!</em>
              </p>

              {/* PhotoStrip Element to Download */}
              <div className="p-4 bg-white/40 rounded-3xl shadow-sm border border-white/60 mb-6">
                <PhotoStrip
                  ref={stripRef}
                  photos={photos}
                  theme={theme}
                  layout={layoutKey}
                  pattern={patternKey}
                  title={stripTitle}
                  setTitle={setStripTitle}
                  dateText={dateText}
                  setDateText={setDateText}
                  showTape={showTape}
                  showBarcode={showBarcode}
                  placedStickers={placedStickers}
                  onRemoveSticker={handleRemoveSticker}
                  filter={filter}
                  onOpenCrop={handleOpenCrop}
                />
              </div>

              {/* Download, Copy & Print Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.06, y: -2 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={downloadStrip}
                  disabled={isExporting}
                  className="rounded-full px-7 py-3.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-cute font-bold text-xl shadow-[0_5px_0_#9333ea] hover:shadow-[0_3px_0_#9333ea] hover:translate-y-[2px] active:translate-y-[5px] active:shadow-none cursor-pointer flex items-center gap-2"
                >
                  <span>{isExporting ? 'Menyimpan...' : 'Unduh Photostrip (HD) 💾'}</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={copyToClipboard}
                  disabled={isExporting}
                  className="rounded-full px-5 py-3 bg-white hover:bg-pink-50 text-stone-700 font-cute font-bold text-base shadow-xs border border-pink-200 transition flex items-center gap-1.5 cursor-pointer"
                  title="Salin langsung ke clipboard untuk dipaste di WhatsApp / Instagram"
                >
                  <span>📋 {copiedToast ? 'Tersalin! ✅' : 'Salin Gambar'}</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePrint}
                  className="rounded-full px-4 py-3 bg-white hover:bg-pink-50 text-stone-700 font-cute font-bold text-base shadow-xs border border-pink-200 transition flex items-center gap-1.5 cursor-pointer"
                  title="Cetak langsung menggunakan printer"
                >
                  <span>🖨️ Cetak</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (soundEnabled) playPopSound()
                    setPhotos([])
                  }}
                  className="rounded-full px-4 py-3 bg-white text-stone-600 font-cute text-sm shadow-xs border border-pink-200 hover:bg-pink-50 transition cursor-pointer"
                >
                  🔄 Reset
                </motion.button>
              </div>

              {copiedToast && (
                <p className="text-xs text-green-700 font-cute font-bold mt-2 animate-bounce">
                  ✨ Berhasil disalin! Kamu bisa langsung Paste (Ctrl+V) di WhatsApp atau Medsos!
                </p>
              )}
            </div>

            {/* Interactive Polaroids Gallery */}
            <div className="mt-14 pt-8 border-t border-pink-200/80">
              <h3 className="font-script text-3xl text-pink-900 mb-2">
                Polaroid Lucu (Bisa Digeser / Drag)
              </h3>
              <p className="text-xs text-stone-500 mb-6">
                Kamu bisa ketik pesan personal di bawah tiap foto polaroid!
              </p>

              <div className="flex flex-wrap gap-8 justify-center items-center p-4 min-h-[320px]">
                {photos.map((p, i) => (
                  <Polaroid
                    key={i}
                    src={p}
                    index={i}
                    theme={theme}
                    filter={filter}
                    sticker={['🎀', '⭐', '🍓', '🐱', '🌷', '💖'][i % 6]}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
