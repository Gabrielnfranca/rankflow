'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  RiCheckLine,
  RiCloseLine,
  RiErrorWarningLine,
  RiSearchLine,
  RiRefreshLine,
  RiDownload2Line,
} from 'react-icons/ri'

// Dados de exemplo
const seoChecklist = {
  meta: {
    title: 'E-commerce XYZ',
    url: 'https://xyz.com',
    lastScan: '2023-12-07 15:30',
  },
  categories: [
    {
      name: 'Otimização On-Page',
      items: [
        { id: 1, name: 'Meta títulos otimizados', status: 'success' },
        { id: 2, name: 'Meta descrições únicas', status: 'warning' },
        { id: 3, name: 'Headers (H1-H6) estruturados', status: 'success' },
        { id: 4, name: 'URLs amigáveis', status: 'success' },
      ],
    },
    {
      name: 'Performance',
      items: [
        { id: 5, name: 'Tempo de carregamento < 3s', status: 'error' },
        { id: 6, name: 'Otimização de imagens', status: 'warning' },
        { id: 7, name: 'Minificação de CSS/JS', status: 'success' },
        { id: 8, name: 'Cache do navegador', status: 'success' },
      ],
    },
    {
      name: 'Indexação',
      items: [
        { id: 9, name: 'Sitemap.xml válido', status: 'success' },
        { id: 10, name: 'Robots.txt configurado', status: 'success' },
        { id: 11, name: 'Sem páginas bloqueadas', status: 'warning' },
        { id: 12, name: 'Canonical tags corretas', status: 'success' },
      ],
    },
  ],
}

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'success':
      return <RiCheckLine className="w-5 h-5 text-green-500" />
    case 'warning':
      return <RiErrorWarningLine className="w-5 h-5 text-yellow-500" />
    case 'error':
      return <RiCloseLine className="w-5 h-5 text-red-500" />
    default:
      return null
  }
}

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
  }[status]

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles}`}>
      {status === 'success' ? 'Aprovado' : status === 'warning' ? 'Atenção' : 'Erro'}
    </span>
  )
}

export default function TechnicalSEOPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const stats = {
    success: seoChecklist.categories.flatMap(c => c.items).filter(i => i.status === 'success').length,
    warning: seoChecklist.categories.flatMap(c => c.items).filter(i => i.status === 'warning').length,
    error: seoChecklist.categories.flatMap(c => c.items).filter(i => i.status === 'error').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Otimização SEO</h1>
          <p className="mt-1 text-sm text-gray-500">
            Última análise: {seoChecklist.meta.lastScan}
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary">
            <RiDownload2Line className="w-5 h-5 mr-2" />
            Baixar Relatório
          </button>
          <button className="btn-primary">
            <RiRefreshLine className="w-5 h-5 mr-2" />
            Executar Nova Análise
          </button>
        </div>
      </div>

      {/* Site Info */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="col-span-2">
            <h2 className="text-lg font-medium text-gray-900">{seoChecklist.meta.title}</h2>
            <a href={seoChecklist.meta.url} className="text-sm text-primary-600 hover:text-primary-700">
              {seoChecklist.meta.url}
            </a>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">Pontuação Geral</div>
            <div className="mt-1 flex items-center">
              <div className="text-2xl font-bold text-gray-900">85</div>
              <span className="ml-2 text-sm text-green-600">+5</span>
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">Problemas Encontrados</div>
            <div className="mt-1 flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1" />
                <span className="text-sm">{stats.success}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1" />
                <span className="text-sm">{stats.warning}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-1" />
                <span className="text-sm">{stats.error}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Checklist de Otimização SEO</h3>
          
          {seoChecklist.categories.map((category, categoryIndex) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="mb-8 last:mb-0"
            >
              <h4 className="text-md font-medium text-gray-900 mb-4">{category.name}</h4>
              <div className="space-y-4">
                {category.items.map((item, itemIndex) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (categoryIndex * 0.1) + (itemIndex * 0.05) }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <StatusIcon status={item.status} />
                      <span className="text-sm text-gray-900">{item.name}</span>
                    </div>
                    <StatusBadge status={item.status} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
