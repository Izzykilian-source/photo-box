import { motion } from 'framer-motion'

export default function Sparkles() {
  const sparkles = [
    { top: '8%', left: '8%', size: 'text-2xl', delay: 0 },
    { top: '22%', right: '10%', size: 'text-xl', delay: 0.6 },
    { top: '50%', left: '4%', size: 'text-2xl', delay: 1.2 },
    { bottom: '25%', right: '6%', size: 'text-3xl', delay: 0.3 },
    { bottom: '10%', left: '12%', size: 'text-2xl', delay: 1.8 },
    { top: '35%', right: '22%', size: 'text-lg', delay: 2.1 },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {sparkles.map((s, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{
            opacity: [0.15, 0.7, 0.15],
            scale: [0.8, 1.25, 0.8],
            rotate: [0, 15, -15, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 3 + (i % 3),
            delay: s.delay,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            top: s.top,
            left: s.left,
            right: s.right,
            bottom: s.bottom,
          }}
          className={`${s.size} select-none filter drop-shadow-sm`}
        >
          {i % 2 === 0 ? '✨' : '⭐'}
        </motion.span>
      ))}
    </div>
  )
}
