import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Backlink } from '../contexts/BacklinkContext';
import { useClients } from '../contexts/ClientContext';

interface BacklinkFormProps {
  backlink?: Backlink;
  onSubmit: (data: Omit<Backlink, 'id'>) => void;
  onCancel: () => void;
}

export function BacklinkForm({ backlink, onSubmit, onCancel }: BacklinkFormProps) {
  const { theme } = useTheme();
  const { clients } = useClients();
  const [formData, setFormData] = React.useState({
    client: backlink?.client || '',
    url: backlink?.url || '',
    targetUrl: backlink?.targetUrl || '',
    da: backlink?.da || 0,
    dr: backlink?.dr || 0,
    price: backlink?.price || 0,
    status: backlink?.status || 'prospectado',
    paymentStatus: backlink?.paymentStatus || 'pendente',
    dateProspected: backlink?.dateProspected || new Date().toISOString().split('T')[0],
    datePublished: backlink?.datePublished || '',
    notes: backlink?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleClientChange = (selectedClientName: string) => {
    const selectedClient = clients.find(c => c.name === selectedClientName);
    setFormData(prev => ({
      ...prev,
      client: selectedClientName,
      targetUrl: selectedClient?.website ? `https://${selectedClient.website}` : ''
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cliente */}
        <div>
          <label className={`block text-sm font-medium mb-1 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Cliente
          </label>
          <select
            value={formData.client}
            onChange={e => handleClientChange(e.target.value)}
            className={`w-full px-3 py-2 rounded-lg border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
          >
            <option value="">Selecione um cliente</option>
            {clients.map(client => (
              <option key={client.id} value={client.name}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        {/* URL do Site */}
        <div>
          <label className={`block text-sm font-medium mb-1 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            URL do Site
          </label>
          <input
            type="url"
            value={formData.url}
            onChange={e => setFormData(prev => ({ ...prev, url: e.target.value }))}
            className={`w-full px-3 py-2 rounded-lg border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
          />
        </div>

        {/* URL Alvo */}
        <div>
          <label className={`block text-sm font-medium mb-1 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            URL Alvo
          </label>
          <input
            type="url"
            value={formData.targetUrl}
            onChange={e => setFormData(prev => ({ ...prev, targetUrl: e.target.value }))}
            className={`w-full px-3 py-2 rounded-lg border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
          />
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              DA
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.da}
              onChange={e => setFormData(prev => ({ ...prev, da: Number(e.target.value) }))}
              className={`w-full px-3 py-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              DR
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.dr}
              onChange={e => setFormData(prev => ({ ...prev, dr: Number(e.target.value) }))}
              className={`w-full px-3 py-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
          </div>
        </div>

        {/* Preço */}
        <div>
          <label className={`block text-sm font-medium mb-1 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Preço (R$)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={e => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
            className={`w-full px-3 py-2 rounded-lg border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
          />
        </div>

        {/* Status */}
        <div>
          <label className={`block text-sm font-medium mb-1 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Status
          </label>
          <select
            value={formData.status}
            onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as Backlink['status'] }))}
            className={`w-full px-3 py-2 rounded-lg border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="prospectado">Prospectado</option>
            <option value="negociacao">Em Negociação</option>
            <option value="aprovado">Aprovado</option>
            <option value="publicado">Publicado</option>
            <option value="recusado">Recusado</option>
          </select>
        </div>

        {/* Status de Pagamento */}
        <div>
          <label className={`block text-sm font-medium mb-1 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Status de Pagamento
          </label>
          <select
            value={formData.paymentStatus}
            onChange={e => setFormData(prev => ({ ...prev, paymentStatus: e.target.value as Backlink['paymentStatus'] }))}
            className={`w-full px-3 py-2 rounded-lg border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="pendente">Pendente</option>
            <option value="pago">Pago</option>
          </select>
        </div>

        {/* Data de Prospecção */}
        <div>
          <label className={`block text-sm font-medium mb-1 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Data de Prospecção
          </label>
          <input
            type="date"
            value={formData.dateProspected}
            onChange={e => setFormData(prev => ({ ...prev, dateProspected: e.target.value }))}
            className={`w-full px-3 py-2 rounded-lg border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
          />
        </div>

        {/* Data de Publicação */}
        <div>
          <label className={`block text-sm font-medium mb-1 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Data de Publicação
          </label>
          <input
            type="date"
            value={formData.datePublished}
            onChange={e => setFormData(prev => ({ ...prev, datePublished: e.target.value }))}
            className={`w-full px-3 py-2 rounded-lg border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>
      </div>

      {/* Observações */}
      <div>
        <label className={`block text-sm font-medium mb-1 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Observações
        </label>
        <textarea
          value={formData.notes}
          onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          rows={3}
          className={`w-full px-3 py-2 rounded-lg border ${
            theme === 'dark'
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'bg-white border-gray-300 text-gray-900'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
      </div>

      {/* Botões */}
      <div className="flex justify-end space-x-3 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            theme === 'dark'
              ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          {backlink ? 'Salvar Alterações' : 'Adicionar Backlink'}
        </button>
      </div>
    </form>
  );
}
