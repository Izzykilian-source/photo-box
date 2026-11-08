import { useEffect, useRef, useState } from 'react'

export default function useCamera() {
  const videoRef = useRef(null)
  const [error, setError] = useState(null)
  const [facingMode, setFacingMode] = useState('user')

  useEffect(() => {
    let active = true
    let currentStream = null

    if (!navigator?.mediaDevices?.getUserMedia) {
      return () => {}
    }

    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      })
      .then(s => {
        if (!active) {
          s.getTracks().forEach(t => t.stop())
          return
        }
        currentStream = s
        if (videoRef.current) {
          videoRef.current.setAttribute('playsinline', 'true')
          videoRef.current.setAttribute('webkit-playsinline', 'true')
          videoRef.current.srcObject = s
          videoRef.current.play().catch(() => {})
        }
      })
      .catch(() => {
        if (active) {
          setError('Kamera tidak bisa diakses. Cek izin kamera browser ya!')
        }
      })

    return () => {
      active = false
      if (currentStream) {
        currentStream.getTracks().forEach(t => t.stop())
      }
    }
  }, [facingMode])

  const flipCamera = () => {
    setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'))
  }

  const capture = (filter = 'none') => {
    const v = videoRef.current
    if (!v) return null
    const c = document.createElement('canvas')
    c.width = v.videoWidth || 640
    c.height = v.videoHeight || 480
    const ctx = c.getContext('2d')
    ctx.filter = filter

    if (facingMode === 'user') {
      // Mirror user front camera
      ctx.translate(c.width, 0)
      ctx.scale(-1, 1)
    }
    ctx.drawImage(v, 0, 0, c.width, c.height)
    return c.toDataURL('image/png')
  }

  return { videoRef, capture, error, facingMode, flipCamera }
}
