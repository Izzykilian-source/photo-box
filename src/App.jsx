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
import {
  themes,
  layouts,
  patterns,
  filters,
  aestheticEffects,
} from './themes'
import { playShutterSound, playBeepSound, playPopSound, unlockAudio } from './utils/audio'

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

  // Studio Navigation Tabs
  const [studioTab, setStudioTab] = useState('filter') // 'frame' | 'filter' | 'adjust' | 'stickers'

  // Cropping Tool States
  const [cropModalOpen, setCropModalOpen] = useState(false)
  const [cropTargetIndex, setCropTargetIndex] = useState(null)
  const [cropImageSrc, setCropImageSrc] = useState(null)

  // Styling & Design Variety States
  const [themeKey, setThemeKey] = useState('strawberry')
  const [layoutKey, setLayoutKey] = useState('strip4')
  const [patternKey, setPatternKey] = useState('dots')
  const [filterKey, setFilterKey] = useState('🌸 Pastel Bloom')
  const [effectKey, setEffectKey] = useState('none')
  const [stripTitle, setStripTitle] = useState('Cute Photobox ♡')
  const [dateText, setDateText] = useState('2026.11.09')
  const [showTape, setShowTape] = useState(true)
  const [showBarcode, setShowBarcode] = useState(true)
  const [placedStickers, setPlacedStickers] = useState([])
  const [isExporting, setIsExporting] = useState(false)
  const [copiedToast, setCopiedToast] = useState(false)

  // Photo Edits & Fine-Tuning Adjustments
  const [adjustments, setAdjustments] = useState({
    brightness: 100, // 75 - 125
    contrast: 100, // 75 - 125
    saturation: 100, // 50 - 150
    warmth: 0, // 0 - 50
    cornerRadius: 4, // 0 | 6 | 14
    showDateStamp: true,
  })

  const theme = themes[themeKey]
  const layout = layouts[layoutKey]
  const filter = filters[filterKey] || 'none'
  const effectClass = aestheticEffects[effectKey]?.class || ''
  const cropAspectRatio = layoutKey === 'grid2x2' ? 1 : 4 / 3

  // Combined CSS filter for previews
  const combinedFilter = [
    filter !== 'none' ? filter : '',
    adjustments.brightness !== 100 ? `brightness(${adjustments.brightness}%)` : '',
    adjustments.contrast !== 100 ? `contrast(${adjustments.contrast}%)` : '',
    adjustments.saturation !== 100 ? `saturate(${adjustments.saturation}%)` : '',
    adjustments.warmth > 0 ? `sepia(${adjustments.warmth}%)` : '',
  ]
    .filter(Boolean)
    .join(' ') || 'none'

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
    unlockAudio()
    setBusy(true)
    setPhotos([])
    const totalShots = layout.shots

    for (let i = 0; i < totalShots; i++) {
      for (let n = timerSeconds; n > 0; n--) {
        setCount(n)
        if (soundEnabled) playBeepSound(520, 0.08)
        await wait(1000)
      }
      setCount(0)

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

  // Reset Adjustments
  const resetAdjustments = () => {
    if (soundEnabled) playPopSound()
    setAdjustments({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      warmth: 0,
      cornerRadius: 4,
      showDateStamp: true,
    })
  }

  // Download Photostrip as High-Res PNG (Supports iOS / Android Native Share Sheet)
  const downloadStrip = async () => {
    if (!stripRef.current || photos.length === 0) return
    setIsExporting(true)
    if (soundEnabled) playPopSound()

    try {
      await wait(100)
      const blob = await toBlob(stripRef.current, {
        pixelRatio: 2.5,
        cacheBust: true,
      })
      if (!blob) throw new Error('Blob generation failed')

      const fileName = `photobox-${themeKey}-${Date.now()}.png`
      const file = new File([blob], fileName, { type: 'image/png' })

      // On iOS / Android: trigger native Share Sheet (Allows direct "Save to Photos" / "Simpan Gambar")
      if (
        navigator.canShare &&
        navigator.canShare({ files: [file] }) &&
        /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      ) {
        try {
          await navigator.share({
            files: [file],
            title: 'Cute Photobox ♡',
          })
          setIsExporting(false)
          return
        } catch (shareErr) {
          if (shareErr.name === 'AbortError') {
            setIsExporting(false)
            return
          }
        }
      }

      // Standard desktop download link fallback
      const dataUrl = await toPng(stripRef.current, {
        pixelRatio: 2.5,
        cacheBust: true,
      })
      const link = document.createElement('a')
      link.download = fileName
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
    <div className="min-h-screen relative overflow-x-hidden font-sans pb-24">
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

      <main className="max-w-4xl mx-auto px-3.5 sm:px-4 pt-6 text-center relative z-10">
        {/* Header Section */}
        <header className="mb-5">
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
            className="font-script text-4xl sm:text-5xl md:text-6xl text-pink-900 tracking-tight drop-shadow-sm mb-1"
          >
            📸 Cute Photobox
          </motion.h1>
          <p className="font-cute text-stone-600 text-sm sm:text-base md:text-lg">
            Abadikan momen estetik ala Life4Cuts • Filter, efek lucu, crop & frame beragam!
          </p>
        </header>

        {/* Mode Switcher Tabs */}
        <div className="flex justify-center mb-5">
          <div className="bg-white/90 backdrop-blur-md p-1 rounded-full shadow-md border border-pink-200/80 inline-flex gap-1 max-w-full">
            <button
              onClick={() => {
                setMode('camera')
                if (soundEnabled) playPopSound()
              }}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
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
              className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                mode === 'upload'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-xs'
                  : 'text-stone-600 hover:text-pink-600'
              }`}
            >
              📁 Unggah Foto
            </button>
          </div>
        </div>

        {/* Input Area: Live Camera or Upload Mode */}
        <section className="mb-7">
          {mode === 'camera' ? (
            <div>
              <Camera
                videoRef={videoRef}
                filter={combinedFilter}
                count={count}
                flash={flash}
                error={error}
                facingMode={facingMode}
                onFlipCamera={flipCamera}
              />

              {/* Camera Controls & Timer Selector */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
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
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={startCameraCapture}
                  disabled={busy || !!error}
                  className="rounded-full px-7 sm:px-8 py-3 bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 text-white font-cute font-bold text-lg sm:text-xl shadow-[0_5px_0_#d84a75] hover:shadow-[0_3px_0_#d84a75] hover:translate-y-[2px] active:translate-y-[5px] active:shadow-none disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
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
              filter={combinedFilter}
              onOpenCrop={handleOpenCrop}
            />
          )}
        </section>

        {/* --- STUDIO CUSTOMIZATION STATION (BERBAGAI EDITAN & FILTER RAPI) --- */}
        <section className="bg-white/90 backdrop-blur-md rounded-3xl p-4 sm:p-6 shadow-xl border border-pink-200/90 mb-8 max-w-3xl mx-auto text-left">
          {/* Studio Navigation Pills */}
          <div className="flex items-center justify-between gap-1 overflow-x-auto pb-3 mb-4 border-b border-pink-100 no-scrollbar">
            {[
              { id: 'filter', label: '✨ Filter & Efek', icon: '🪄' },
              { id: 'frame', label: '🎨 Frame & Motif', icon: '🖼️' },
              { id: 'adjust', label: '🎛️ Editan & Tone', icon: '🎚️' },
              { id: 'stickers', label: '🎀 Stiker & Teks', icon: '🏷️' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setStudioTab(tab.id)
                  if (soundEnabled) playPopSound()
                }}
                className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-cute font-bold transition-all shrink-0 cursor-pointer ${
                  studioTab === tab.id
                    ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-xs'
                    : 'bg-pink-50/70 text-stone-600 hover:bg-pink-100 hover:text-pink-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* TAB 1: FILTER & EFEK ESTETIK */}
          {studioTab === 'filter' && (
            <div className="space-y-5">
              {/* Aesthetic Filter Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs sm:text-sm font-cute font-bold text-pink-950 flex items-center gap-1.5">
                    <span>🌸</span> Pilihan 14 Filter Estetik (Korea & Vintage Film)
                  </label>
                  <span className="text-[11px] text-pink-600 font-cute">
                    Aktif: {filterKey}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {Object.keys(filters).map(fName => {
                    const isSelected = filterKey === fName
                    return (
                      <button
                        key={fName}
                        type="button"
                        onClick={() => {
                          setFilterKey(fName)
                          if (soundEnabled) playPopSound()
                        }}
                        className={`p-2.5 rounded-2xl text-xs font-cute font-bold text-left border transition cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-pink-500 text-white border-pink-500 shadow-sm'
                            : 'bg-pink-50/50 hover:bg-pink-100/70 border-pink-200/80 text-stone-700'
                        }`}
                      >
                        <span className="line-clamp-1">{fName}</span>
                        <span
                          className={`text-[10px] mt-1 font-mono ${
                            isSelected ? 'text-pink-100' : 'text-stone-400'
                          }`}
                        >
                          {isSelected ? '✓ Dipakai' : 'Pilih'}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Aesthetic Visual Overlays & Effects */}
              <div className="pt-4 border-t border-pink-100">
                <label className="text-xs sm:text-sm font-cute font-bold text-pink-950 flex items-center gap-1.5 mb-2">
                  <span>✨</span> Efek-Efek Visual Lucu & Menawan
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.entries(aestheticEffects).map(([k, ef]) => {
                    const isSelected = effectKey === k
                    return (
                      <button
                        key={k}
                        type="button"
                        onClick={() => {
                          setEffectKey(k)
                          if (soundEnabled) playPopSound()
                        }}
                        className={`p-2.5 rounded-2xl text-xs font-cute font-bold text-left border transition cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                            : 'bg-purple-50/50 hover:bg-purple-100/70 border-purple-200/80 text-stone-700'
                        }`}
                      >
                        <span className="line-clamp-1">{ef.name}</span>
                        {isSelected && <span className="text-xs">✓</span>}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FRAME & MOTIF */}
          {studioTab === 'frame' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {/* Theme Selector */}
                <div>
                  <label className="block text-xs font-cute font-bold text-stone-700 mb-1">
                    🌸 Tema Warna Frame
                  </label>
                  <select
                    value={themeKey}
                    onChange={e => handleThemeChange(e.target.value)}
                    className="w-full rounded-2xl px-3 py-2 bg-pink-50/80 border border-pink-200 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-pink-300 outline-none shadow-xs cursor-pointer"
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
                  <label className="block text-xs font-cute font-bold text-stone-700 mb-1">
                    📐 Format Layout
                  </label>
                  <select
                    value={layoutKey}
                    onChange={e => {
                      setLayoutKey(e.target.value)
                      if (soundEnabled) playPopSound()
                    }}
                    className="w-full rounded-2xl px-3 py-2 bg-pink-50/80 border border-pink-200 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-pink-300 outline-none shadow-xs cursor-pointer"
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
                  <label className="block text-xs font-cute font-bold text-stone-700 mb-1">
                    ✨ Motif / Pola Frame
                  </label>
                  <select
                    value={patternKey}
                    onChange={e => {
                      setPatternKey(e.target.value)
                      if (soundEnabled) playPopSound()
                    }}
                    className="w-full rounded-2xl px-3 py-2 bg-pink-50/80 border border-pink-200 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-pink-300 outline-none shadow-xs cursor-pointer"
                  >
                    {Object.entries(patterns).map(([k, p]) => (
                      <option key={k} value={k}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Toggles & Text Inputs */}
              <div className="pt-3 border-t border-pink-100 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-stone-700 font-cute">
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
                    <span>Barcode Cetak</span>
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <span>Tanggal:</span>
                  <input
                    type="text"
                    value={dateText}
                    onChange={e => setDateText(e.target.value)}
                    placeholder="YYYY.MM.DD"
                    className="w-28 px-2.5 py-1 text-center bg-white border border-pink-200 rounded-xl text-xs sm:text-sm font-mono shadow-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PENYESUAIAN & TONE (EDITAN SLIDER) */}
          {studioTab === 'adjust' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-pink-100">
                <span className="text-xs sm:text-sm font-cute font-bold text-pink-950">
                  🎛️ Pengaturan Pencahayaan & Tone Foto
                </span>
                <button
                  type="button"
                  onClick={resetAdjustments}
                  className="text-xs text-rose-500 hover:text-rose-700 underline font-cute font-bold cursor-pointer"
                >
                  Reset Penyesuaian
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Brightness */}
                <div className="bg-pink-50/50 p-3 rounded-2xl border border-pink-100">
                  <div className="flex justify-between text-xs font-cute font-bold text-stone-700 mb-1">
                    <span>☀️ Kecerahan (Brightness):</span>
                    <span className="font-mono">{adjustments.brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="75"
                    max="125"
                    step="1"
                    value={adjustments.brightness}
                    onChange={e =>
                      setAdjustments(prev => ({
                        ...prev,
                        brightness: parseInt(e.target.value, 10),
                      }))
                    }
                    className="w-full accent-pink-500 cursor-pointer"
                  />
                </div>

                {/* Contrast */}
                <div className="bg-pink-50/50 p-3 rounded-2xl border border-pink-100">
                  <div className="flex justify-between text-xs font-cute font-bold text-stone-700 mb-1">
                    <span>🌓 Kontras (Contrast):</span>
                    <span className="font-mono">{adjustments.contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="75"
                    max="125"
                    step="1"
                    value={adjustments.contrast}
                    onChange={e =>
                      setAdjustments(prev => ({
                        ...prev,
                        contrast: parseInt(e.target.value, 10),
                      }))
                    }
                    className="w-full accent-pink-500 cursor-pointer"
                  />
                </div>

                {/* Saturation */}
                <div className="bg-pink-50/50 p-3 rounded-2xl border border-pink-100">
                  <div className="flex justify-between text-xs font-cute font-bold text-stone-700 mb-1">
                    <span>🎨 Kejenuhan Warna (Saturation):</span>
                    <span className="font-mono">{adjustments.saturation}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    step="1"
                    value={adjustments.saturation}
                    onChange={e =>
                      setAdjustments(prev => ({
                        ...prev,
                        saturation: parseInt(e.target.value, 10),
                      }))
                    }
                    className="w-full accent-pink-500 cursor-pointer"
                  />
                </div>

                {/* Warmth */}
                <div className="bg-pink-50/50 p-3 rounded-2xl border border-pink-100">
                  <div className="flex justify-between text-xs font-cute font-bold text-stone-700 mb-1">
                    <span>☕ Kehangatan / Vintage Warmth:</span>
                    <span className="font-mono">{adjustments.warmth}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="1"
                    value={adjustments.warmth}
                    onChange={e =>
                      setAdjustments(prev => ({
                        ...prev,
                        warmth: parseInt(e.target.value, 10),
                      }))
                    }
                    className="w-full accent-pink-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Extra Details: Corner Radius & Retro Date Stamp */}
              <div className="pt-3 border-t border-pink-100 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-cute text-stone-700">
                <div className="flex items-center gap-2">
                  <span>Sudut Foto:</span>
                  {[
                    { label: 'Tegak (0px)', r: 0 },
                    { label: 'Sedang (4px)', r: 4 },
                    { label: 'Bulat (14px)', r: 14 },
                  ].map(c => (
                    <button
                      key={c.r}
                      type="button"
                      onClick={() =>
                        setAdjustments(prev => ({ ...prev, cornerRadius: c.r }))
                      }
                      className={`px-2.5 py-1 rounded-xl font-bold transition cursor-pointer border ${
                        adjustments.cornerRadius === c.r
                          ? 'bg-pink-500 text-white border-pink-500'
                          : 'bg-white hover:bg-pink-50 border-pink-200 text-stone-600'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>

                <label className="flex items-center gap-1.5 cursor-pointer font-bold text-orange-700 bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-200">
                  <input
                    type="checkbox"
                    checked={adjustments.showDateStamp}
                    onChange={e =>
                      setAdjustments(prev => ({
                        ...prev,
                        showDateStamp: e.target.checked,
                      }))
                    }
                    className="accent-orange-500 rounded"
                  />
                  <span>⏰ Stempel Tanggal Oranye 90s</span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 4: STIKER & TEKS */}
          {studioTab === 'stickers' && (
            <div>
              <StickerToolbar
                onAddSticker={handleAddSticker}
                placedStickers={placedStickers}
                onClearStickers={() => setPlacedStickers([])}
              />
            </div>
          )}
        </section>

        {/* --- RESULTS SECTION (PHOTOSTRIP & ACTIONS) --- */}
        {photos.length > 0 && (
          <section className="mt-8">
            {/* Quick Crop Selector Bar */}
            <div className="mb-6 flex flex-wrap items-center justify-center gap-2 bg-white/80 backdrop-blur-md p-3 rounded-2xl border border-pink-200 shadow-xs max-w-xl mx-auto">
              <span className="text-xs sm:text-sm font-cute font-bold text-stone-700 flex items-center gap-1">
                ✂️ Atur Posisi / Crop:
              </span>
              {photos.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleOpenCrop(i)}
                  className="px-3 py-1 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-700 text-xs sm:text-sm font-cute font-bold transition cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  Foto #{i + 1}
                </button>
              ))}
            </div>

            {/* Photostrip & Action Controls */}
            <div className="flex flex-col items-center justify-center my-6">
              <h2 className="font-script text-3xl sm:text-4xl text-pink-900 mb-1">
                Hasil Photostrip Kamu ♡
              </h2>
              <p className="text-xs text-stone-500 mb-5">
                💡 <em>Klik langsung pada foto di dalam strip untuk crop/atur posisi!</em>
              </p>

              {/* PhotoStrip Element to Download */}
              <div className="p-3 sm:p-5 bg-white/40 rounded-3xl shadow-sm border border-white/60 mb-6">
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
                  adjustments={adjustments}
                  effectClass={effectClass}
                  onOpenCrop={handleOpenCrop}
                />
              </div>

              {/* Download, Copy & Print Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
                <motion.button
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={downloadStrip}
                  disabled={isExporting}
                  className="rounded-full px-6 sm:px-8 py-3.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-cute font-bold text-lg sm:text-xl shadow-[0_5px_0_#9333ea] hover:shadow-[0_3px_0_#9333ea] hover:translate-y-[2px] active:translate-y-[5px] active:shadow-none cursor-pointer flex items-center gap-2"
                >
                  <span>{isExporting ? 'Menyimpan...' : 'Unduh Photostrip (HD) 💾'}</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={copyToClipboard}
                  disabled={isExporting}
                  className="rounded-full px-4 sm:px-5 py-3 bg-white hover:bg-pink-50 text-stone-700 font-cute font-bold text-sm sm:text-base shadow-xs border border-pink-200 transition flex items-center gap-1.5 cursor-pointer"
                  title="Salin langsung ke clipboard untuk dipaste di WhatsApp / Instagram"
                >
                  <span>📋 {copiedToast ? 'Tersalin! ✅' : 'Salin Gambar'}</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handlePrint}
                  className="rounded-full px-4 py-3 bg-white hover:bg-pink-50 text-stone-700 font-cute font-bold text-sm sm:text-base shadow-xs border border-pink-200 transition flex items-center gap-1.5 cursor-pointer"
                  title="Cetak langsung menggunakan printer"
                >
                  <span>🖨️ Cetak</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    if (soundEnabled) playPopSound()
                    setPhotos([])
                  }}
                  className="rounded-full px-4 py-3 bg-white text-stone-600 font-cute text-xs sm:text-sm shadow-xs border border-pink-200 hover:bg-pink-50 transition cursor-pointer"
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
            <div className="mt-12 pt-8 border-t border-pink-200/80">
              <h3 className="font-script text-3xl text-pink-900 mb-1">
                Polaroid Lucu (Bisa Digeser / Drag)
              </h3>
              <p className="text-xs text-stone-500 mb-6">
                Kamu bisa ketik pesan personal di bawah tiap foto polaroid!
              </p>

              <div className="flex flex-wrap gap-8 justify-center items-center p-4 min-h-[300px]">
                {photos.map((p, i) => (
                  <Polaroid
                    key={i}
                    src={p}
                    index={i}
                    theme={theme}
                    filter={combinedFilter}
                    effectClass={effectClass}
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
