import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { playPopSound } from '../utils/audio'

export default function CropModal({
  isOpen,
  imageSrc,
  aspectRatio = 4 / 3, // width / height
  onSave,
  onClose,
}) {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(0) // 0, 90, 180, 270
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const imgRef = useRef(null)
  const containerRef = useRef(null)

  // Mouse / Touch Drag handlers
  const handleMouseDown = e => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
  }

  const handleMouseMove = useCallback(
    e => {
      if (!isDragging) return
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    },
    [isDragging, dragStart]
  )

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Touch handlers for mobile
  const handleTouchStart = e => {
    if (e.touches.length === 1) {
      setIsDragging(true)
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      })
    }
  }

  const handleTouchMove = useCallback(
    e => {
      if (!isDragging || e.touches.length !== 1) return
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      })
    },
    [isDragging, dragStart]
  )

  const handleRotate = () => {
    playPopSound()
    setRotation(prev => (prev + 90) % 360)
  }

  const handleReset = () => {
    playPopSound()
    setScale(1)
    setPosition({ x: 0, y: 0 })
    setRotation(0)
  }

  // Perform Final Canvas Crop
  const handleApplyCrop = () => {
    const img = imgRef.current
    const container = containerRef.current
    if (!img || !container) return

    playPopSound()

    // Output canvas size (high resolution for sharp export)
    const outWidth = 1200
    const outHeight = Math.round(outWidth / aspectRatio)

    const canvas = document.createElement('canvas')
    canvas.width = outWidth
    canvas.height = outHeight
    const ctx = canvas.getContext('2d')

    // Dimensions of the preview box
    const rect = container.getBoundingClientRect()
    const cropBoxW = rect.width
    const cropBoxH = rect.height

    // Calculate mapping from preview coordinates to output canvas coordinates
    const scaleFactor = outWidth / cropBoxW

    // Fill background
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, outWidth, outHeight)

    ctx.save()
    // Move to center of canvas
    ctx.translate(outWidth / 2, outHeight / 2)

    // Apply rotation
    ctx.rotate((rotation * Math.PI) / 180)

    // Apply scale and user drag position
    ctx.scale(scale * scaleFactor, scale * scaleFactor)
    ctx.translate(position.x / scale, position.y / scale)

    // Render image centered
    const naturalW = img.naturalWidth || img.width
    const naturalH = img.naturalHeight || img.height

    // Scale image to cover container at scale=1
    const baseScale = Math.max(cropBoxW / naturalW, cropBoxH / naturalH)
    const drawW = naturalW * baseScale
    const drawH = naturalH * baseScale

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH)
    ctx.restore()

    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92)
    onSave(croppedDataUrl)
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-pink-200 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-pink-100 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">✂️</span>
              <h3 className="font-cute font-bold text-xl text-pink-950">
                Atur Posisi & Crop Foto
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 flex items-center justify-center font-bold text-sm transition cursor-pointer"
            >
              ✕
            </button>
          </div>

          <p className="text-xs text-stone-500 mb-3 text-center">
            Tarik (drag) foto untuk menggeser posisi, gunakan slider untuk zoom & putar.
          </p>

          {/* Interactive Crop Viewport Box */}
          <div className="relative mx-auto flex items-center justify-center bg-stone-900 rounded-2xl overflow-hidden shadow-inner select-none max-w-[340px]">
            <div
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
              style={{
                aspectRatio: `${aspectRatio}`,
                width: '100%',
                maxHeight: '340px',
              }}
              className="relative overflow-hidden cursor-grab active:cursor-grabbing flex items-center justify-center touch-none"
            >
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Crop preview"
                draggable={false}
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) scale(${scale})`,
                  transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%',
                }}
                className="pointer-events-none select-none"
              />

              {/* Grid overlay lines (Rule of Thirds) */}
              <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 border border-white/40">
                <div className="border-r border-b border-white/20" />
                <div className="border-r border-b border-white/20" />
                <div className="border-b border-white/20" />
                <div className="border-r border-b border-white/20" />
                <div className="border-r border-b border-white/20" />
                <div className="border-b border-white/20" />
                <div className="border-r border-white/20" />
                <div className="border-r border-white/20" />
                <div />
              </div>
            </div>
          </div>

          {/* Controls: Zoom & Rotate */}
          <div className="mt-4 space-y-3 bg-pink-50/60 p-3.5 rounded-2xl border border-pink-100">
            {/* Zoom Slider */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-cute font-bold text-stone-700 min-w-[50px]">
                🔍 Zoom:
              </span>
              <input
                type="range"
                min="0.8"
                max="3"
                step="0.05"
                value={scale}
                onChange={e => setScale(parseFloat(e.target.value))}
                className="flex-1 accent-pink-500 cursor-pointer"
              />
              <span className="text-xs font-mono text-stone-500 w-10 text-right">
                {Math.round(scale * 100)}%
              </span>
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-pink-100/80">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRotate}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-pink-100 text-stone-700 border border-pink-200 text-xs font-cute font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <span>🔄</span> Putar 90°
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-pink-100 text-stone-700 border border-pink-200 text-xs font-cute font-bold transition cursor-pointer"
                >
                  Reset Posisi
                </button>
              </div>

              <span className="text-[11px] font-mono text-stone-500">
                Rotasi: {rotation}°
              </span>
            </div>
          </div>

          {/* Action buttons: Cancel & Apply */}
          <div className="mt-5 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-stone-600 hover:bg-stone-100 text-xs font-bold transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleApplyCrop}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white text-xs font-cute font-bold shadow-md hover:shadow-lg transition cursor-pointer flex items-center gap-1.5"
            >
              <span>✨</span> Terapkan Crop
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
