import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { MoreVertical, Trash2, Pencil, GripVertical, AlertCircle, Clock, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TaskCardProps {
  task: {
    id: number;
    title: string;
    description?: string;
    labels: string[];
    checklist: string[];
    clientId: string;
    deadline: string;
    status: 'pendente' | 'em_progresso' | 'concluida';
    tags: string[];
    createdAt: string;
    completedAt?: string;
  };
  dragHandleProps?: any;
  onDelete: (id: number) => void;
  onEdit: (id: number, data: any) => void;
  selectedTag?: string;
}

export function TaskCard({ task, dragHandleProps, onDelete, onEdit, selectedTag }: TaskCardProps) {
  const { theme } = useTheme();
  const [showActions, setShowActions] = useState(false);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [checkedItems, setCheckedItems] = useState<boolean[]>(
    new Array(task.checklist.length).fill(false)
  );

  const progress = Math.round(
    (checkedItems.filter(Boolean).length / checkedItems.length) * 100
  );

  const toggleCheckItem = (index: number) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];
    setCheckedItems(newCheckedItems);
    
    if (newCheckedItems.every(Boolean)) {
      onEdit(task.id, { status: 'concluida', completedAt: new Date().toISOString() });
    }
  };

  return (
    <>
      <div
        className={`relative rounded-lg shadow-sm ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } cursor-pointer transition-all duration-200 hover:shadow-md`}
        onClick={() => setShowTaskDetails(true)}
      >
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className={`font-medium ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
              }`}>
                {task.title}
              </h3>
              <p className={`text-sm mt-1 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {task.clientId}
              </p>
            </div>
            
            <div {...dragHandleProps}>
              <GripVertical className={`w-5 h-5 ${
                theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
              }`} />
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-3">
            <div className="flex justify-between text-sm mb-1">
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Progresso
              </span>
              <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                {progress}%
              </span>
            </div>
            <div className={`h-2 rounded-full ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Checklist expandable */}
          <div className={`mt-4 space-y-2 transition-all duration-300 ${
            showTaskDetails || (selectedTag && task.tags.includes(selectedTag)) ? 'block' : 'hidden'
          }`}>
            {task.checklist.map((item: string, index: number) => (
              <div
                key={index}
                className="flex items-start space-x-3 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCheckItem(index);
                }}
              >
                <div className={`w-4 h-4 mt-1 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  checkedItems[index]
                    ? 'bg-blue-500 border-blue-500'
                    : theme === 'dark'
                    ? 'border-gray-600'
                    : 'border-gray-300'
                }`}>
                  {checkedItems[index] && (
                    <svg className="w-3 h-3 text-white" viewBox="0 0 12 12">
                      <path
                        d="M3.5 6.5l2 2 3-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <span className={`text-sm ${
                  checkedItems[index]
                    ? theme === 'dark'
                      ? 'line-through text-gray-500'
                      : 'line-through text-gray-400'
                    : theme === 'dark'
                    ? 'text-gray-300'
                    : 'text-gray-700'
                }`}>
                  {item}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              {task.tags.map(tag => (
                <span key={tag} className={`px-2 py-1 text-xs rounded-full mr-1 ${
                  tag === 'Urgente'
                    ? 'bg-red-100 text-red-700'
                    : tag === 'Prioritário'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                  {tag}
                </span>
              ))}
              <span className={`text-xs ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {format(new Date(task.deadline), "dd MMM 'às' HH:mm", { locale: ptBR })}
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(!showActions);
              }}
              className={`p-1 rounded-lg transition-colors ${
                showActions
                  ? theme === 'dark'
                    ? 'bg-gray-700 text-gray-200'
                    : 'bg-gray-200 text-gray-700'
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showActions && (
              <div className={`absolute right-0 mt-2 w-36 rounded-lg shadow-lg py-1 z-10 ${
                theme === 'dark' 
                  ? 'bg-gray-800 border border-gray-700' 
                  : 'bg-white border border-gray-200'
              }`}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(task.id, {});
                    setShowActions(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm flex items-center ${
                    theme === 'dark'
                      ? 'hover:bg-gray-700'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Editar
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(task.id);
                    setShowActions(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm flex items-center text-red-600 ${
                    theme === 'dark'
                      ? 'hover:bg-gray-700'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Details Modal */}
      {showTaskDetails && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-black/50 transition-opacity"
              onClick={() => setShowTaskDetails(false)}
            />

            {/* Modal */}
            <div className={`relative rounded-lg shadow-xl w-full max-w-2xl transform transition-all ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className={`text-xl font-semibold ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                    }`}>
                      {task.title}
                    </h2>
                    <p className={`mt-1 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Cliente: {task.clientId}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowTaskDetails(false)}
                    className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Two Column Layout */}
                <div className="flex gap-6">
                  {/* Left Column - Checklist */}
                  <div className="flex-1">
                    <div>
                      <h3 className={`text-lg font-medium mb-4 ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                      }`}>
                        Checklist
                      </h3>
                      
                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                            Progresso
                          </span>
                          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                            {progress}%
                          </span>
                        </div>
                        <div className={`h-2 rounded-full ${
                          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                        }`}>
                          <div
                            className="h-full rounded-full bg-blue-500 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Checklist Items */}
                      <div className="space-y-3">
                        {task.checklist.map((item: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-start space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded-lg transition-colors"
                            onClick={() => toggleCheckItem(index)}
                          >
                            <div className={`w-4 h-4 mt-1 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                              checkedItems[index]
                                ? 'bg-blue-500 border-blue-500'
                                : theme === 'dark'
                                ? 'border-gray-600'
                                : 'border-gray-300'
                            }`}>
                              {checkedItems[index] && (
                                <svg className="w-3 h-3 text-white" viewBox="0 0 12 12">
                                  <path
                                    d="M3.5 6.5l2 2 3-4"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              )}
                            </div>
                            <span className={`text-sm ${
                              checkedItems[index]
                                ? theme === 'dark'
                                  ? 'line-through text-gray-500'
                                  : 'line-through text-gray-400'
                                : theme === 'dark'
                                ? 'text-gray-300'
                                : 'text-gray-700'
                            }`}>
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Details */}
                  <div className="w-64 space-y-6">
                    {/* Info Grid */}
                    <div className="space-y-4">
                      <div>
                        <label className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Labels
                        </label>
                        <p className={`mt-1 ${
                          theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                        }`}>
                          {task.labels.join(', ')}
                        </p>
                      </div>
                      <div>
                        <label className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Tags
                        </label>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {task.tags.map(tag => (
                            <span key={tag} className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm ${
                              tag === 'Urgente'
                                ? 'bg-red-100 text-red-800'
                                : tag === 'Prioritário'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Prazo
                        </label>
                        <p className={`mt-1 ${
                          theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                        }`}>
                          {format(new Date(task.deadline), "dd MMM 'às' HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                      <div>
                        <label className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Status
                        </label>
                        <p className={`mt-1 ${
                          theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                        }`}>
                          {task.status === 'pendente' ? 'Pendente'
                            : task.status === 'em_progresso' ? 'Em Progresso'
                            : 'Concluída'}
                        </p>
                      </div>
                    </div>

                    {/* Description if exists */}
                    {task.description && (
                      <div>
                        <h3 className={`text-sm font-medium mb-2 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Descrição
                        </h3>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {task.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-8 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowTaskDetails(false)}
                    className={`px-4 py-2 rounded-lg ${
                      theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Fechar
                  </button>
                  <button
                    onClick={() => {
                      onEdit(task.id, {});
                      setShowTaskDetails(false);
                    }}
                    className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                  >
                    Editar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
