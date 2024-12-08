'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  RiAddLine,
  RiSearchLine,
  RiFilter3Line,
  RiExternalLinkLine,
  RiMoneyDollarCircleLine,
  RiCalendarLine,
} from 'react-icons/ri'

// Dados de exemplo
const backlinks = [
  {
    id: 1,
    sourceSite: 'blog.tech',
    targetUrl: '/produtos/categoria-1',
    da: 45,
    dr: 38,
    status: 'Ativo',
    type: 'Dofollow',
    cost: 150,
    purchaseDate: '2023-12-01',
  },
  {
    id: 2,
    sourceSite: 'news.digital',
    targetUrl: '/sobre',
    da: 52,
    dr: 47,
    status: 'Pendente',
    type: 'Dofollow',
    cost: 200,
    purchaseDate: '2023-12-05',
  },
]

const stats = {
  totalBacklinks: 143,
  activeBacklinks: 138,
  averageDA: 42,
  totalInvestment: 15750,
}

export default function BacklinksPage() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Gestão de Backlinks</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie seus backlinks e monitore o orçamento
          </p>
        </div>
        <button className="btn-primary">
          <RiAddLine className="w-5 h-5 mr-2" />
          Adicionar Backlink
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-500">Total de Backlinks</div>
            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
              <RiExternalLinkLine className="w-4 h-4 text-primary-600" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline">
            <div className="text-2xl font-semibold text-gray-900">{stats.totalBacklinks}</div>
            <div className="ml-2 text-sm text-green-600">+12%</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-500">Backlinks Ativos</div>
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline">
            <div className="text-2xl font-semibold text-gray-900">{stats.activeBacklinks}</div>
            <div className="ml-2 text-sm text-green-600">96.5%</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-500">Média DA/DR</div>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">DA</span>
            </div>
          </div>
          <div className="mt-2 flex items-baseline">
            <div className="text-2xl font-semibold text-gray-900">{stats.averageDA}</div>
            <div className="ml-2 text-sm text-green-600">+3</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-500">Investimento Total</div>
            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
              <RiMoneyDollarCircleLine className="w-4 h-4 text-primary-600" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline">
            <div className="text-2xl font-semibold text-gray-900">
              R$ {stats.totalInvestment.toLocaleString()}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <RiSearchLine className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="input pl-10"
              placeholder="Buscar backlinks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <select className="input max-w-xs">
          <option value="all">Todos os Status</option>
          <option value="active">Ativos</option>
          <option value="pending">Pendentes</option>
          <option value="expired">Expirados</option>
        </select>
        <button className="btn-secondary">
          <RiFilter3Line className="w-5 h-5 mr-2" />
          Mais Filtros
        </button>
      </div>

      {/* Tabela de Backlinks */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Site Fonte
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  URL Destino
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  DA/DR
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Custo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {backlinks.map((backlink, index) => (
                <motion.tr
                  key={backlink.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{backlink.sourceSite}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{backlink.targetUrl}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {backlink.da}/{backlink.dr}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      backlink.status === 'Ativo'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {backlink.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {backlink.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">R$ {backlink.cost}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {backlink.purchaseDate}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
