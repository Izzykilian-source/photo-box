import { motion } from 'framer-motion'
import { getVipRemainingText } from '../utils/premium'

export default function VipBadge({ isVip, onOpenVip }) {
  if (isVip) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-900 text-xs font-cute font-bold shadow-xs border border-amber-200 select-none"
      >
        <span>👑</span>
        <span>VIP Aktif</span>
        <span className="text-[10px] font-mono opacity-80">({getVipRemainingText()})</span>
      </motion.div>
    )
  }

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
      onClick={onOpenVip}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white text-xs font-cute font-bold shadow-md hover:shadow-lg transition cursor-pointer border border-pink-300 animate-pulse"
    >
      <span>👑</span>
      <span>Jadi VIP · Rp 5rb</span>
    </motion.button>
  )
}

