import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { playPopSound } from '../utils/audio'

// Preset sample photos in case user wants to test quickly
const SAMPLE_PHOTOS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
]

// Resize huge mobile camera images to reasonable canvas resolution
function processImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => {
      const img = new Image()
      img.onload = () => {
        const maxDim = 1400
        let { width, height } = img
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width)
            width = maxDim
          } else {
            width = Math.round((width * maxDim) / height)
            height = maxDim
          }
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.92))
      }
      img.onerror = reject
      img.src = e.target.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function PhotoUploader({
  photos,
  setPhotos,
  maxShots = 4,
  filter = 'none',
  onOpenCrop,
}) {
  const fileInputRef = useRef(null)
  const [replaceSlot, setReplaceSlot] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleFiles = async (fileList, targetSlot = null) => {
    const files = Array.from(fileList).filter(f => f.type.startsWith('image/'))
    if (!files.length) return

    setIsLoading(true)
    playPopSound()

    try {
      if (targetSlot !== null && targetSlot >= 0) {
        // Replace a specific slot
        const singlePhoto = await processImageFile(files[0])
        setPhotos(prev => {
          const next = [...prev]
          next[targetSlot] = singlePhoto
          return next
        })
        // Offer instant crop modal for this newly uploaded slot
        if (onOpenCrop) {
          onOpenCrop(targetSlot, singlePhoto)
        }
      } else {
        // Batch upload
        const processed = await Promise.all(files.slice(0, maxShots).map(processImageFile))
        setPhotos(prev => {
          const combined = [...prev, ...processed]
          return combined.slice(0, maxShots)
        })
      }
    } catch (err) {
      console.error('Gagal memproses gambar:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const onDrop = e => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleSlotClick = index => {
    setReplaceSlot(index)
    fileInputRef.current?.click()
  }

  const handleRemovePhoto = (e, index) => {
    e.stopPropagation()
    playPopSound()
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const loadSamplePhotos = () => {
    playPopSound()
    setPhotos(SAMPLE_PHOTOS.slice(0, maxShots))
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={replaceSlot === null}
        className="hidden"
        onChange={e => {
          if (e.target.files) {
            handleFiles(e.target.files, replaceSlot)
            setReplaceSlot(null)
            e.target.value = ''
          }
        }}
      />

      {/* Drag & Drop Zone */}
      <motion.div
        onDragOver={e => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        whileHover={{ scale: 1.01 }}
        onClick={() => {
          setReplaceSlot(null)
          fileInputRef.current?.click()
        }}
        className={`relative cursor-pointer rounded-3xl border-3 border-dashed p-6 text-center transition-colors duration-200 ${
          isDragging
            ? 'border-pink-500 bg-pink-50/80 shadow-lg'
            : 'border-pink-300 bg-white/70 hover:border-pink-400 hover:bg-pink-50/30'
        }`}
      >
        <div className="text-4xl mb-2 select-none">📁 🌸</div>
        <h3 className="font-cute font-bold text-xl text-pink-900 mb-1">
          Tarik & Lepas Foto di Sini, atau Klik untuk Unggah
        </h3>
        <p className="text-xs text-pink-600/80 mb-3">
          Mendukung JPG, PNG, WEBP dari HP atau Komputer (Maksimal {maxShots} foto)
        </p>

        <div className="flex flex-wrap gap-2 justify-center">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-pink-100 text-pink-700 shadow-xs hover:bg-pink-200 transition">
            📂 Pilih Foto
          </span>
          <button
            type="button"
            onClick={e => {
              e.stopPropagation()
              loadSamplePhotos()
            }}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 hover:bg-purple-200 transition cursor-pointer"
          >
            ✨ Coba Foto Contoh
          </button>
        </div>

        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs rounded-3xl flex items-center justify-center">
            <span className="animate-spin text-2xl">🪄</span>
            <span className="ml-2 font-cute text-pink-700 text-lg">Memproses foto...</span>
          </div>
        )}
      </motion.div>

      {/* Uploaded Slots Preview */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-stone-600 px-1 mb-2 font-medium">
          <span>Slot Foto ({photos.length}/{maxShots}) • Klik foto untuk crop/ganti</span>
          {photos.length > 0 && (
            <button
              onClick={() => {
                playPopSound()
                setPhotos([])
              }}
              className="text-pink-600 hover:text-pink-800 transition cursor-pointer"
            >
              Hapus Semua
            </button>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: maxShots }).map((_, idx) => {
            const hasPhoto = photos[idx]
            return (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03 }}
                className={`relative aspect-square rounded-2xl overflow-hidden border-2 flex items-center justify-center transition-all ${
                  hasPhoto
                    ? 'border-pink-300 bg-black shadow-sm group'
                    : 'border-dashed border-pink-200 bg-white/50 hover:bg-pink-50 cursor-pointer'
                }`}
                onClick={() => {
                  if (!hasPhoto) handleSlotClick(idx)
                }}
              >
                {hasPhoto ? (
                  <>
                    <img
                      src={hasPhoto}
                      alt={`Slot ${idx + 1}`}
                      style={{ filter }}
                      className="w-full h-full object-cover"
                    />
                    {/* Hover Overlay with Crop & Change buttons */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1 text-white">
                      {onOpenCrop && (
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation()
                            onOpenCrop(idx, hasPhoto)
                          }}
                          className="bg-pink-500 hover:bg-pink-600 px-2 py-0.5 rounded-full text-[10px] font-cute font-bold flex items-center gap-1 transition cursor-pointer w-full justify-center"
                        >
                          ✂️ Crop
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation()
                          handleSlotClick(idx)
                        }}
                        className="bg-white/30 hover:bg-white/50 px-2 py-0.5 rounded-full text-[10px] font-cute font-medium transition cursor-pointer w-full text-center"
                      >
                        🔄 Ganti
                      </button>
                      <button
                        type="button"
                        onClick={e => handleRemovePhoto(e, idx)}
                        className="bg-red-500/80 hover:bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] transition cursor-pointer mt-0.5"
                        title="Hapus foto"
                      >
                        ✕
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-pink-300 group-hover:text-pink-500 transition">
                    <span className="text-xl font-bold">+</span>
                    <span className="text-[10px] font-cute">Slot {idx + 1}</span>
                  </div>
                )}
                <span className="absolute top-1 left-1.5 text-[9px] bg-black/60 text-white px-1 rounded-sm font-mono pointer-events-none">
                  #{idx + 1}
                </span>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
