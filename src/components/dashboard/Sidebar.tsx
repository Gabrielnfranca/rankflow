'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  RiDashboardLine,
  RiUserLine,
  RiFileListLine,
  RiLinksFill,
  RiSearchEyeLine,
  RiSettings4Line,
  RiLogoutBoxLine,
} from 'react-icons/ri'
import Logo from '../Logo'

const menuItems = [
  { icon: RiDashboardLine, label: 'Dashboard', href: '/dashboard' },
  { icon: RiUserLine, label: 'Clientes', href: '/dashboard/clients' },
  { icon: RiFileListLine, label: 'Projetos', href: '/dashboard/projects' },
  { icon: RiLinksFill, label: 'Backlinks', href: '/dashboard/backlinks' },
  { icon: RiSearchEyeLine, label: 'SEO Técnico', href: '/dashboard/technical-seo' },
  { icon: RiSettings4Line, label: 'Configurações', href: '/dashboard/settings' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-4">
        <Logo />
      </div>

      <nav className="mt-8 px-4">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center space-x-3 px-3 py-2 my-1 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary-50 rounded-lg"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <item.icon className="w-5 h-5 relative z-10" />
              <span className="relative z-10">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
        <button className="flex items-center space-x-3 text-gray-600 hover:text-red-600 transition-colors w-full px-3 py-2">
          <RiLogoutBoxLine className="w-5 h-5" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  )
}
