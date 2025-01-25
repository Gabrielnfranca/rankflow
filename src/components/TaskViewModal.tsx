import React from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../contexts/ThemeContext';
import { Task } from '../pages/Tasks';
import { Calendar, Clock, Users, Tag, Edit2, X, AlertCircle, Check, Type } from 'lucide-react';

interface TaskViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onEdit: () => void;
}

const taskTypeChecklists = {
  'SEO Técnico': [
    'Análise técnica do site',
    'Otimização de meta tags',
    'Otimização de URLs',
    'Otimização de imagens',
    'Correção de erros de rastreamento',
    'Implementação de Schema Markup',
    'Otimização de robots.txt e sitemap',
    'Análise de velocidade de carregamento'
  ],
  'Keyword Research': [
    'Pesquisa de palavras-chave principais',
    'Análise de concorrentes',
    'Identificação de long-tail keywords',
    'Análise de volume de busca',
    'Análise de sazonalidade',
    'Mapeamento de intenção de busca',
    'Agrupamento de palavras-chave',
    'Priorização de keywords'
  ],
  'Backlinks': [
    'Análise do perfil de links atual',
    'Identificação de oportunidades',
    'Prospecção de sites parceiros',
    'Criação de conteúdo para guest post',
    'Monitoramento de menções da marca',
    'Análise de links tóxicos',
    'Recuperação de links quebrados',
    'Relatório de autoridade de domínio'
  ],
  'Conteúdo': [
    'Planejamento de pauta',
    'Pesquisa de referências',
    'Produção de conteúdo otimizado',
    'Revisão de SEO on-page',
    'Adição de mídias e recursos visuais',
    'Otimização de títulos e meta descriptions',
    'Interligação de conteúdos',
    'Análise de métricas de engajamento'
  ]
} as const;

export function TaskViewModal({ isOpen, onClose, task, onEdit }: TaskViewModalProps) {
  const { theme } = useTheme();
  const [completedItems, setCompletedItems] = React.useState<string[]>([]);

  const toggleItem = (item: string) => {
    setCompletedItems(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  if (!isOpen) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta':
        return theme === 'dark' 
          ? 'bg-red-900/30 text-red-400' 
          : 'bg-red-100 text-red-800';
      case 'Média':
        return theme === 'dark' 
          ? 'bg-yellow-900/30 text-yellow-400' 
          : 'bg-yellow-100 text-yellow-800';
      default:
        return theme === 'dark' 
          ? 'bg-green-900/30 text-green-400' 
          : 'bg-green-100 text-green-800';
    }
  };

  const deadlineStatus = () => {
    const deadlineDate = new Date(task.deadline + 'T00:00:00');
    const now = new Date();
    const diffTime = Math.abs(deadlineDate - now);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'expired';
    } else if (diffDays <= 1) {
      return 'urgent';
    } else if (diffDays <= 3) {
      return 'warning';
    } else {
      return 'normal';
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div 
          className="fixed inset-0 bg-black/50 transition-opacity" 
          onClick={onClose}
        />
        
        <div className={`relative w-full max-w-2xl p-6 rounded-lg shadow-xl ${
          theme === 'dark' ? 'bg-[#2B2B2B]' : 'bg-white'
        }`}>
          {/* Cabeçalho */}
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-2xl font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {task.title}
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-full transition-colors ${
                theme === 'dark'
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300'
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Etiquetas */}
          {task.labels && task.labels.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {task.labels.map((label) => (
                <span
                  key={label.id}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: label.color,
                    color: '#FFFFFF',
                    textShadow: '0px 1px 2px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <Tag className="w-3 h-3" />
                  {label.name}
                </span>
              ))}
            </div>
          )}

          {/* Checklist do tipo da tarefa */}
          <div className="mb-6">
            <div className={`flex items-center gap-2 mb-3 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <Type className="w-5 h-5" />
              <span className="font-medium">Checklist de {task.type}</span>
            </div>

            {/* Barra de Progresso */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Progresso: {completedItems.length} de {taskTypeChecklists[task.type].length} itens
                </span>
                <span className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {Math.round((completedItems.length / taskTypeChecklists[task.type].length) * 100)}%
                </span>
              </div>
              <div className={`h-2 rounded-full ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${(completedItems.length / taskTypeChecklists[task.type].length) * 100}%` }}
                />
              </div>
            </div>

            <div className={`space-y-2 pl-7 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {taskTypeChecklists[task.type].map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-2 cursor-pointer hover:opacity-80"
                  onClick={() => toggleItem(item)}
                >
                  <div className={`w-4 h-4 mt-1 border rounded-sm flex items-center justify-center ${
                    completedItems.includes(item)
                      ? theme === 'dark'
                        ? 'bg-blue-500 border-blue-500'
                        : 'bg-blue-600 border-blue-600'
                      : theme === 'dark'
                      ? 'border-gray-600'
                      : 'border-gray-300'
                  }`}>
                    {completedItems.includes(item) && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className={completedItems.includes(item) ? 'line-through opacity-60' : ''}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Informações principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className={`flex flex-col gap-3 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>{task.client}</span>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{new Date(task.deadline + 'T00:00:00').toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}</span>
                  {task.time && (
                    <>
                      <Clock className="w-5 h-5 ml-2" />
                      <span>{task.time}</span>
                    </>
                  )}
                </div>

                {deadlineStatus() !== 'normal' && (
                  <div className={`flex items-center gap-3 p-3 rounded-lg ${
                    deadlineStatus() === 'expired'
                      ? 'bg-red-50 border border-red-100 dark:bg-red-900/10 dark:border-red-900/20'
                      : deadlineStatus() === 'urgent'
                      ? 'bg-orange-50 border border-orange-100 dark:bg-orange-900/10 dark:border-orange-900/20'
                      : 'bg-yellow-50 border border-yellow-100 dark:bg-yellow-900/10 dark:border-yellow-900/20'
                  }`}>
                    {deadlineStatus() === 'expired' ? (
                      <AlertCircle className={`w-5 h-5 ${
                        theme === 'dark' ? 'text-red-400' : 'text-red-500'
                      }`} />
                    ) : deadlineStatus() === 'urgent' ? (
                      <Clock className={`w-5 h-5 ${
                        theme === 'dark' ? 'text-orange-400' : 'text-orange-500'
                      }`} />
                    ) : (
                      <AlertCircle className={`w-5 h-5 ${
                        theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'
                      }`} />
                    )}
                    <div className="flex flex-col">
                      <span className={`font-medium ${
                        deadlineStatus() === 'expired'
                          ? theme === 'dark' ? 'text-red-400' : 'text-red-700'
                          : deadlineStatus() === 'urgent'
                          ? theme === 'dark' ? 'text-orange-400' : 'text-orange-700'
                          : theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700'
                      }`}>
                        {deadlineStatus() === 'expired'
                          ? 'Prazo Expirado'
                          : deadlineStatus() === 'urgent'
                          ? 'Entrega Urgente'
                          : 'Atenção ao Prazo'}
                      </span>
                      <span className={`text-sm ${
                        deadlineStatus() === 'expired'
                          ? theme === 'dark' ? 'text-red-300' : 'text-red-600'
                          : deadlineStatus() === 'urgent'
                          ? theme === 'dark' ? 'text-orange-300' : 'text-orange-600'
                          : theme === 'dark' ? 'text-yellow-300' : 'text-yellow-600'
                      }`}>
                        {deadlineStatus() === 'expired'
                          ? 'Esta tarefa está atrasada'
                          : deadlineStatus() === 'urgent'
                          ? 'Entrega em menos de 1 hora'
                          : 'Entrega em menos de 72 horas'}
                      </span>
                    </div>
                  </div>
                )}
                {task.completedAt && (
                  <div className="flex items-center gap-2 mt-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600 dark:text-green-400">
                      Entregue em: {new Date(task.completedAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  theme === 'dark' 
                    ? 'bg-gray-800 text-gray-300' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {task.type}
                </span>
              </div>
            </div>
          </div>

          {/* Descrição */}
          {task.description && (
            <div className={`mt-4 p-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'
            }`}>
              <p className={`whitespace-pre-wrap ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {task.description}
              </p>
            </div>
          )}

          {/* Botões */}
          <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                theme === 'dark'
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onEdit();
                onClose();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              Editar
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
