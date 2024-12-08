'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  RiAddLine,
  RiSearchLine,
  RiFilter3Line,
  RiBarChartLine,
  RiLinksFill,
  RiFileTextLine,
  RiCodeLine,
} from 'react-icons/ri'

// Dados de exemplo
const projects = [
  {
    id: 1,
    name: 'E-commerce XYZ',
    client: 'XYZ Comércio',
    status: 'Em andamento',
    progress: 75,
    tasks: {
      total: 24,
      completed: 18,
    },
    metrics: {
      rankings: '+15',
      backlinks: 45,
      traffic: '+28%',
    },
  },
  {
    id: 2,
    name: 'Blog Tech',
    client: 'Tech Solutions',
    status: 'Em análise',
    progress: 30,
    tasks: {
      total: 18,
      completed: 5,
    },
    metrics: {
      rankings: '+8',
      backlinks: 23,
      traffic: '+12%',
    },
  },
]

const ProjectCard = ({ project }: { project: any }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      {/* Cabeçalho do Card */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
            <p className="text-sm text-gray-500">{project.client}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            project.status === 'Em andamento' 
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {project.status}
          </span>
        </div>

        {/* Barra de Progresso */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progresso Geral</span>
            <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${project.progress}%` }}
              className="bg-primary-600 h-2 rounded-full"
            />
          </div>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-500">Rankings</div>
            <div className="mt-1 text-xl font-semibold text-green-600">{project.metrics.rankings}</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-gray-500">Backlinks</div>
            <div className="mt-1 text-xl font-semibold text-gray-900">{project.metrics.backlinks}</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-gray-500">Tráfego</div>
            <div className="mt-1 text-xl font-semibold text-green-600">{project.metrics.traffic}</div>
          </div>
        </div>

        {/* Tarefas */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Tarefas Completadas</span>
            <span className="font-medium text-gray-900">
              {project.tasks.completed}/{project.tasks.total}
            </span>
          </div>
        </div>
      </div>

      {/* Ações */}
      <div className="bg-gray-50 px-6 py-4">
        <div className="flex justify-between">
          <button className="btn-secondary text-sm">
            <RiBarChartLine className="w-4 h-4 mr-2" />
            Ver Relatório
          </button>
          <button className="btn-primary text-sm">
            <RiFileTextLine className="w-4 h-4 mr-2" />
            Gerenciar
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Projetos</h1>
        <button className="btn-primary">
          <RiAddLine className="w-5 h-5 mr-2" />
          Novo Projeto
        </button>
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
              placeholder="Buscar projetos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <select className="input max-w-xs">
          <option value="all">Todos os Status</option>
          <option value="active">Em andamento</option>
          <option value="analysis">Em análise</option>
          <option value="completed">Concluídos</option>
        </select>
        <button className="btn-secondary">
          <RiFilter3Line className="w-5 h-5 mr-2" />
          Mais Filtros
        </button>
      </div>

      {/* Lista de Projetos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  )
}
