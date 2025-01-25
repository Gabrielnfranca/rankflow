import React from 'react';
import { Modal } from './Modal';
import { useTheme } from '../contexts/ThemeContext';
import { useTasks } from '../contexts/TaskContext';
import { useClients } from '../contexts/ClientContext';
import { X, Search, Calendar, AlertCircle, Users, Tag, Type, Clock, Pencil } from 'lucide-react';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    client: string;
    deadline: string;
    time: string;
    priority: 'Alta' | 'Média' | 'Baixa';
    type: 'SEO Técnico' | 'Keyword Research' | 'Backlinks' | 'Conteúdo';
    description: string;
    labels: Array<{ id: number; name: string; color: string }>;
  }) => void;
  initialData?: {
    title: string;
    client: string;
    deadline: string;
    time: string;
    priority: 'Alta' | 'Média' | 'Baixa';
    type: 'SEO Técnico' | 'Keyword Research' | 'Backlinks' | 'Conteúdo';
    description: string;
    labels: Array<{ id: number; name: string; color: string }>;
  };
}

// Simulação de etiquetas cadastradas (substitua pela sua fonte de dados real)
const DEFAULT_LABELS = [
  { id: 1, name: 'Urgente', color: '#FF6B6B' },
  { id: 2, name: 'Em Espera', color: '#4ECDC4' },
  { id: 3, name: 'Revisão', color: '#45B7D1' },
  { id: 4, name: 'Bug Fix', color: '#FFB6B9' },
  { id: 5, name: 'Feature', color: '#A8E6CF' }
];

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

export function NewTaskModal({ isOpen, onClose, onSubmit, initialData }: NewTaskModalProps) {
  const { theme } = useTheme();
  const { clients } = useClients();
  const { tasks } = useTasks();
  const [title, setTitle] = React.useState(initialData?.title || '');
  const [client, setClient] = React.useState(initialData?.client || '');
  const [deadline, setDeadline] = React.useState(initialData?.deadline || '');
  const [time, setTime] = React.useState(initialData?.time || '');
  const [priority, setPriority] = React.useState<'Alta' | 'Média' | 'Baixa'>(initialData?.priority || 'Média');
  const [type, setType] = React.useState<'SEO Técnico' | 'Keyword Research' | 'Backlinks' | 'Conteúdo'>(
    initialData?.type || 'SEO Técnico'
  );
  const [description, setDescription] = React.useState(initialData?.description || '');
  const [selectedLabels, setSelectedLabels] = React.useState<Array<{ id: number; name: string; color: string }>>(
    initialData?.labels || []
  );
  const [clientSearch, setClientSearch] = React.useState('');
  const [showClientDropdown, setShowClientDropdown] = React.useState(false);
  const [showLabelEditor, setShowLabelEditor] = React.useState(false);
  const [labels, setLabels] = React.useState(DEFAULT_LABELS);
  const [editingLabel, setEditingLabel] = React.useState<{id: number; name: string; color: string} | null>(null);

  // Reseta o formulário quando o modal é fechado
  const handleClose = () => {
    setTitle('');
    setClient('');
    setDeadline('');
    setTime('');
    setPriority('Média');
    setType('SEO Técnico');
    setDescription('');
    setSelectedLabels([]);
    setClientSearch('');
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      title,
      client,
      deadline,
      time,
      priority,
      type,
      description,
      labels: selectedLabels
    });
    
    handleClose();
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const toggleLabel = (labelId: number) => {
    const label = labels.find(l => l.id === labelId);
    if (!label) return;

    setSelectedLabels(prev => {
      const isSelected = prev.some(l => l.id === labelId);
      if (isSelected) {
        return prev.filter(l => l.id !== labelId);
      } else {
        return [...prev, label];
      }
    });
  };

  const handleEditLabel = (label: typeof labels[0]) => {
    setEditingLabel(label);
    setShowLabelEditor(true);
  };

  const handleSaveLabel = (label: { id: number; name: string; color: string }) => {
    setLabels(prev => prev.map(l => l.id === label.id ? label : l));
    setShowLabelEditor(false);
    setEditingLabel(null);
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'Alta': return 'text-red-500';
      case 'Média': return 'text-yellow-500';
      case 'Baixa': return 'text-green-500';
      default: return '';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={initialData ? 'Editar Tarefa' : 'Nova Tarefa'}>
      <div className={`p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {initialData ? 'Editar Tarefa' : 'Nova Tarefa'}
            </h2>
            <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Preencha os detalhes da tarefa abaixo
            </p>
          </div>
          <button
            onClick={handleClose}
            className={`p-2 rounded-full transition-colors ${
              theme === 'dark'
                ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300'
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className={`flex items-center text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}
            >
              <Type className="w-4 h-4 mr-2" />
              Título
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título da tarefa"
              className={`mt-1 block w-full text-base rounded-lg shadow-sm border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent p-3`}
              required
            />
          </div>

          <div className="relative">
            <label
              htmlFor="client"
              className={`flex items-center text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}
            >
              <Users className="w-4 h-4 mr-2" />
              Cliente
            </label>
            <div className="relative mt-1">
              <input
                type="text"
                value={clientSearch}
                onChange={(e) => {
                  setClientSearch(e.target.value);
                  setShowClientDropdown(true);
                }}
                onFocus={() => setShowClientDropdown(true)}
                placeholder="Pesquisar cliente..."
                className={`block w-full text-base rounded-lg shadow-sm border pr-10 ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent p-3`}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            
            {showClientDropdown && (
              <div 
                className={`absolute z-10 mt-1 w-full rounded-lg shadow-lg ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-white'
                } border ${
                  theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
                }`}
              >
                {filteredClients.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setClient(c.name);
                      setClientSearch(c.name);
                      setShowClientDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-blue-50 dark:hover:bg-gray-600 flex items-center justify-between ${
                      client === c.name ? 'bg-blue-50 dark:bg-gray-600' : ''
                    }`}
                  >
                    <span className={`text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {c.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="deadline"
                className={`flex items-center text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Data de Entrega
              </label>
              <input
                type="date"
                id="deadline"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className={`mt-1 block w-full text-base rounded-lg shadow-sm border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent p-3`}
                required
              />
            </div>

            <div>
              <label
                htmlFor="time"
                className={`flex items-center text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}
              >
                <Clock className="w-4 h-4 mr-2" />
                Horário
              </label>
              <input
                type="time"
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={`mt-1 block w-full text-base rounded-lg shadow-sm border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent p-3`}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="priority"
                className={`flex items-center text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                Prioridade
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'Alta' | 'Média' | 'Baixa')}
                className={`mt-1 block w-full text-base rounded-lg shadow-sm border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent p-3`}
              >
                {['Alta', 'Média', 'Baixa'].map((p) => (
                  <option key={p} value={p} className={getPriorityColor(p)}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="type"
                className={`flex items-center text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}
              >
                <Tag className="w-4 h-4 mr-2" />
                Tipo
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) =>
                  setType(
                    e.target.value as 'SEO Técnico' | 'Keyword Research' | 'Backlinks' | 'Conteúdo'
                  )
                }
                className={`mt-1 block w-full text-base rounded-lg shadow-sm border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent p-3`}
              >
                <option value="SEO Técnico">SEO Técnico</option>
                <option value="Keyword Research">Keyword Research</option>
                <option value="Backlinks">Backlinks</option>
                <option value="Conteúdo">Conteúdo</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className={`flex items-center text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}
            >
              <Type className="w-4 h-4 mr-2" />
              Descrição
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva os detalhes da tarefa..."
              rows={3}
              className={`mt-1 block w-full text-base rounded-lg shadow-sm border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent p-3`}
              required
            />
          </div>

          <div>
            <label
              htmlFor="checklist"
              className={`flex items-center text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              Checklist
            </label>
            <div className={`p-4 rounded-lg border ${
              theme === 'dark'
                ? 'bg-gray-700/50 border-gray-600'
                : 'bg-gray-50 border-gray-200'
            }`}>
              {taskTypeChecklists[type].map((item, index) => (
                <div key={index} className="flex items-center space-x-3 py-2">
                  <div className={`w-4 h-4 rounded border-2 flex-shrink-0 ${
                    theme === 'dark'
                      ? 'border-gray-500'
                      : 'border-gray-400'
                  }`} />
                  <span className={`text-sm ${
                    theme === 'dark'
                      ? 'text-gray-300'
                      : 'text-gray-600'
                  }`}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                className={`flex items-center text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}
              >
                <Tag className="w-4 h-4 mr-2" />
                Etiquetas
              </label>
              <button
                type="button"
                onClick={() => setShowLabelEditor(true)}
                className={`text-sm flex items-center ${
                  theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                }`}
              >
                <Pencil className="w-4 h-4" />
                Editar Etiquetas
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {labels.map((label) => (
                <button
                  key={label.id}
                  type="button"
                  onClick={() => toggleLabel(label.id)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                    selectedLabels.some(l => l.id === label.id)
                      ? 'ring-2 ring-offset-1'
                      : 'hover:ring-1 hover:ring-offset-1'
                  }`}
                  style={{
                    backgroundColor: label.color,
                    color: '#FFFFFF',
                    textShadow: '0px 1px 2px rgba(0, 0, 0, 0.2)',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <span className="relative">
                    {label.name}
                  </span>
                  {selectedLabels.some(l => l.id === label.id) && (
                    <X 
                      className="w-4 h-4 hover:scale-110 transition-transform" 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLabel(label.id);
                      }} 
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {showLabelEditor && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
              <div className={`w-full max-w-lg rounded-xl shadow-xl ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } p-6 m-4`}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className={`text-xl font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Gerenciar Etiquetas
                  </h3>
                  <button
                    onClick={() => setShowLabelEditor(false)}
                    className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="grid gap-3 sm:grid-cols-2">
                  {labels.map(label => (
                    <div
                      key={label.id}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                      } hover:shadow-md transition-shadow`}
                      style={{
                        borderLeft: `4px solid ${label.color}`
                      }}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className="w-5 h-5 rounded-md shadow-inner"
                          style={{ backgroundColor: label.color }}
                        />
                        <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {label.name}
                        </span>
                      </div>
                      <button
                        onClick={() => handleEditLabel(label)}
                        className={`p-2 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-600/50 transition-colors`}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {editingLabel && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
              <div className={`w-full max-w-sm rounded-xl shadow-xl ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } p-5`}>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: editingLabel.color }}
                    />
                    <h3 className={`text-base font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      Editar Etiqueta
                    </h3>
                  </div>
                  <button
                    onClick={() => setEditingLabel(null)}
                    className={`p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Nome</label>
                    <input
                      type="text"
                      value={editingLabel.name}
                      onChange={(e) => setEditingLabel({ ...editingLabel, name: e.target.value })}
                      className={`w-full p-2 rounded-lg border text-sm ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                          : 'bg-white border-gray-300 focus:border-blue-500'
                      } transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                      placeholder="Digite o nome da etiqueta..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Cor</label>
                    <div className="flex gap-3">
                      <div className="relative group">
                        <input
                          type="color"
                          value={editingLabel.color}
                          onChange={(e) => setEditingLabel({ ...editingLabel, color: e.target.value })}
                          className="w-10 h-10 rounded-lg cursor-pointer border-2 border-gray-200 dark:border-gray-600"
                        />
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {editingLabel.color.toUpperCase()}
                        </div>
                      </div>
                      <div 
                        className={`flex-1 p-2 rounded-lg text-white text-sm flex items-center justify-center`}
                        style={{ 
                          backgroundColor: editingLabel.color,
                          textShadow: '0px 1px 2px rgba(0, 0, 0, 0.2)'
                        }}
                      >
                        Preview
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setEditingLabel(null)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        theme === 'dark'
                          ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveLabel(editingLabel)}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={handleClose}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              {initialData ? 'Salvar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
