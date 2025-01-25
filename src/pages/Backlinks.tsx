import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useBacklinks, Backlink } from '../contexts/BacklinkContext';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  DollarSign, 
  Link, 
  ArrowUpRight,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { BacklinkForm } from '../components/BacklinkForm';

export function Backlinks() {
  const { theme } = useTheme();
  const { backlinks, addBacklink, updateBacklink, deleteBacklink, getClientExpenses } = useBacklinks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBacklink, setSelectedBacklink] = useState<Backlink | null>(null);

  const getStatusColor = (status: Backlink['status']) => {
    switch (status) {
      case 'publicado':
        return theme === 'dark' ? 'text-green-400' : 'text-green-600';
      case 'aprovado':
        return theme === 'dark' ? 'text-blue-400' : 'text-blue-600';
      case 'recusado':
        return theme === 'dark' ? 'text-red-400' : 'text-red-600';
      case 'negociacao':
        return theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600';
      default:
        return theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const getStatusBadge = (status: Backlink['status']) => {
    const baseClasses = 'px-3 py-1 rounded-full text-sm font-medium';
    switch (status) {
      case 'publicado':
        return `${baseClasses} ${
          theme === 'dark' 
            ? 'bg-green-900/30 text-green-400' 
            : 'bg-green-100 text-green-800'
        }`;
      case 'aprovado':
        return `${baseClasses} ${
          theme === 'dark' 
            ? 'bg-blue-900/30 text-blue-400' 
            : 'bg-blue-100 text-blue-800'
        }`;
      case 'recusado':
        return `${baseClasses} ${
          theme === 'dark' 
            ? 'bg-red-900/30 text-red-400' 
            : 'bg-red-100 text-red-800'
        }`;
      case 'negociacao':
        return `${baseClasses} ${
          theme === 'dark' 
            ? 'bg-yellow-900/30 text-yellow-400' 
            : 'bg-yellow-100 text-yellow-800'
        }`;
      default:
        return `${baseClasses} ${
          theme === 'dark' 
            ? 'bg-gray-900/30 text-gray-400' 
            : 'bg-gray-100 text-gray-800'
        }`;
    }
  };

  const getPaymentStatusBadge = (status: Backlink['paymentStatus']) => {
    const baseClasses = 'px-3 py-1 rounded-full text-sm font-medium';
    return status === 'pago'
      ? `${baseClasses} ${
          theme === 'dark' 
            ? 'bg-green-900/30 text-green-400' 
            : 'bg-green-100 text-green-800'
        }`
      : `${baseClasses} ${
          theme === 'dark' 
            ? 'bg-yellow-900/30 text-yellow-400' 
            : 'bg-yellow-100 text-yellow-800'
        }`;
  };

  // Agrupar backlinks por cliente
  const backlinksByClient = backlinks.reduce((acc, backlink) => {
    if (!acc[backlink.client]) {
      acc[backlink.client] = [];
    }
    acc[backlink.client].push(backlink);
    return acc;
  }, {} as Record<string, Backlink[]>);

  return (
    <div className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className={`text-3xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Gestão de Backlinks
            </h1>
            <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Gerencie seus backlinks e controle os gastos por cliente
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedBacklink(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Novo Backlink
          </button>
        </div>
      </div>

      {/* Lista de Backlinks por Cliente */}
      <div className="space-y-8">
        {Object.entries(backlinksByClient).map(([client, clientBacklinks]) => (
          <div
            key={client}
            className={`rounded-xl border ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
            } shadow-sm overflow-hidden`}
          >
            {/* Header do Cliente */}
            <div className={`p-6 border-b ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className={`text-xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {client}
                  </h2>
                  <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {clientBacklinks.length} backlinks • Investimento total: R$ {
                      getClientExpenses(client).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })
                    }
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                    theme === 'dark' ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'
                  }`}>
                    <CheckCircle className="w-4 h-4" />
                    {clientBacklinks.filter(b => b.status === 'publicado').length} Publicados
                  </span>
                  <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                    theme === 'dark' ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    <Clock className="w-4 h-4" />
                    {clientBacklinks.filter(b => b.status === 'negociacao').length} Em Negociação
                  </span>
                </div>
              </div>
            </div>

            {/* Tabela de Backlinks */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`text-sm ${
                  theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'
                }`}>
                  <tr>
                    <th className={`px-6 py-3 text-left ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>Site</th>
                    <th className={`px-6 py-3 text-left ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>Métricas</th>
                    <th className={`px-6 py-3 text-left ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>Valor</th>
                    <th className={`px-6 py-3 text-left ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>Status</th>
                    <th className={`px-6 py-3 text-left ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>Pagamento</th>
                    <th className={`px-6 py-3 text-right ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {clientBacklinks.map((backlink) => (
                    <tr key={backlink.id} className={
                      theme === 'dark' ? 'hover:bg-gray-900/50' : 'hover:bg-gray-50'
                    }>
                      <td className="px-6 py-4">
                        <div>
                          <a
                            href={backlink.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`font-medium hover:underline ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {new URL(backlink.url).hostname}
                          </a>
                          <p className={`text-sm mt-1 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {backlink.notes}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div>
                            <span className={`text-sm ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              DA
                            </span>
                            <p className={`font-medium ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                              {backlink.da}
                            </p>
                          </div>
                          <div>
                            <span className={`text-sm ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              DR
                            </span>
                            <p className={`font-medium ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                              {backlink.dr}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          R$ {backlink.price.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={getStatusBadge(backlink.status)}>
                          {backlink.status.charAt(0).toUpperCase() + backlink.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={getPaymentStatusBadge(backlink.paymentStatus)}>
                          {backlink.paymentStatus === 'pago' ? 'Pago' : 'Pendente'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedBacklink(backlink);
                              setIsModalOpen(true);
                            }}
                            className={`p-2 rounded-lg hover:bg-opacity-10 ${
                              theme === 'dark'
                                ? 'hover:bg-gray-300'
                                : 'hover:bg-gray-500'
                            }`}
                          >
                            <Edit2 className={`w-5 h-5 ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`} />
                          </button>
                          <button
                            onClick={() => deleteBacklink(backlink.id)}
                            className={`p-2 rounded-lg hover:bg-opacity-10 ${
                              theme === 'dark'
                                ? 'hover:bg-red-300'
                                : 'hover:bg-red-500'
                            }`}
                          >
                            <Trash2 className="w-5 h-5 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Adicionar/Editar Backlink */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div 
              className="fixed inset-0 bg-black/50 transition-opacity"
              onClick={() => setIsModalOpen(false)}
            />
            
            <div className={`relative w-full max-w-2xl p-6 rounded-lg shadow-xl ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h2 className={`text-2xl font-bold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {selectedBacklink ? 'Editar Backlink' : 'Novo Backlink'}
              </h2>

              <BacklinkForm
                backlink={selectedBacklink}
                onSubmit={(data) => {
                  if (selectedBacklink) {
                    updateBacklink(selectedBacklink.id, data);
                  } else {
                    addBacklink(data);
                  }
                  setIsModalOpen(false);
                }}
                onCancel={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
