import { motion } from 'framer-motion'

export default function ProgressBar({ current, total, dark = false }) {
  const percent = Math.round((current / total) * 100)

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span
          className="text-xs font-medium tracking-wide uppercase"
          style={{ color: dark ? 'rgba(255,255,255,0.4)' : '#9CA3AF' }}
        >
          Étape {current} / {total}
        </span>
        <span
          className="text-xs font-semibold"
          style={{ color: dark ? '#FFFFFF' : '#1A1A18' }}
        >
          {percent}%
        </span>
      </div>
      <div
        className="h-1 rounded-full overflow-hidden"
        style={{ background: dark ? 'rgba(255,255,255,0.10)' : '#F3F4F6' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #FF9270, #FFE989)' }}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
