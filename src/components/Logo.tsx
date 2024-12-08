'use client'

import { motion } from 'framer-motion'
import { RiLineChartLine } from 'react-icons/ri'

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`flex items-center space-x-2 ${className}`}
    >
      <div className="relative">
        <motion.div
          animate={{
            rotate: [0, 10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="text-primary-600"
        >
          <RiLineChartLine className="w-8 h-8" />
        </motion.div>
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-secondary-500 rounded-full" />
      </div>
      <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
        RankFlow
      </span>
    </motion.div>
  )
}
