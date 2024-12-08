'use client'

import { motion } from 'framer-motion'
import {
  RiUserLine,
  RiFileListLine,
  RiLinksFill,
  RiBarChartLine,
  RiArrowUpLine,
  RiArrowDownLine,
} from 'react-icons/ri'

// Dados de exemplo
const stats = [
  { name: 'Clientes Ativos', value: '12', icon: RiUserLine, change: 2, changeType: 'increase' },
  { name: 'Projetos', value: '24', icon: RiFileListLine, change: 5, changeType: 'increase' },
  { name: 'Backlinks Ativos', value: '143', icon: RiLinksFill, change: 8, changeType: 'increase' },
  { name: 'Rankings Melhorados', value: '89%', icon: RiBarChartLine, change: 3, changeType: 'decrease' },
]

const recentProjects = [
  { name: 'E-commerce XYZ', status: 'Em andamento', progress: 75 },
  { name: 'Blog Tech', status: 'Em andamento', progress: 45 },
  { name: 'Loja Virtual ABC', status: 'Em análise', progress: 20 },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <button className="btn-primary">
          Novo Projeto
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">{stat.name}</h3>
                  <div className={`flex items-center text-sm ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.changeType === 'increase' ? (
                      <RiArrowUpLine className="h-4 w-4" />
                    ) : (
                      <RiArrowDownLine className="h-4 w-4" />
                    )}
                    <span className="ml-1">{stat.change}%</span>
                  </div>
                </div>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Projects */}
      <div className="card p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Projetos Recentes</h2>
        <div className="space-y-4">
          {recentProjects.map((project, index) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 p-4 rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-900">{project.name}</h3>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800">
                  {project.status}
                </span>
              </div>
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"
                  />
                </div>
                <span className="text-xs text-gray-600 mt-1">{project.progress}% completo</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
