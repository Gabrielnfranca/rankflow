import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useMyBacklinks, MyBacklink } from '../contexts/MyBacklinksContext';
import { Plus, Edit2, Trash2, Link, Globe, BarChart3, DollarSign, Tags } from 'lucide-react';

interface BacklinkFormData {
  url: string;
  da: number;
  dr: number;
  monthlyTraffic: number;
  price: number;
  description: string;
  category: string;
}

export function MyBacklinks() {
  const { theme } = useTheme();
  const { myBacklinks, addMyBacklink, updateMyBacklink, deleteMyBacklink, toggleAvailability } = useMyBacklinks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBacklink, setSelectedBacklink] = useState<MyBacklink | null>(null);
  const [formData, setFormData] = useState<BacklinkFormData>({
    url: '',
    da: 0,
    dr: 0,
    monthlyTraffic: 0,
    price: 0,
    description: '',
    category: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBacklink) {
      updateMyBacklink(selectedBacklink.id, formData);
    } else {
      addMyBacklink({ ...formData, available: true });
    }
    setIsModalOpen(false);
    setSelectedBacklink(null);
    setFormData({
      url: '',
      da: 0,
      dr: 0,
      monthlyTraffic: 0,
      price: 0,
      description: '',
      category: ''
    });
  };

  const handleEdit = (backlink: MyBacklink) => {
    setSelectedBacklink(backlink);
    setFormData({
      url: backlink.url,
      da: backlink.da,
      dr: backlink.dr,
      monthlyTraffic: backlink.monthlyTraffic,
      price: backlink.price,
      description: backlink.description,
      category: backlink.category
    });
    setIsModalOpen(true);
  };

  const categories = Array.from(new Set(myBacklinks.map(b => b.category)));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Meus Backlinks</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie seus backlinks disponíveis para venda
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedBacklink(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Novo Backlink
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(category => (
          <div
            key={category}
            className={`rounded-lg border ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
            } overflow-hidden`}
          >
            <div className={`p-4 border-b ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-2">
                <Tags className="w-5 h-5" />
                <h2 className="text-lg font-medium">{category}</h2>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              {myBacklinks
                .filter(b => b.category === category)
                .map(backlink => (
                  <div
                    key={backlink.id}
                    className={`p-4 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <a
                          href={backlink.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline flex items-center gap-1"
                        >
                          <Globe className="w-4 h-4" />
                          {new URL(backlink.url).hostname}
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {backlink.description}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(backlink)}
                          className={`p-1.5 rounded hover:bg-opacity-10 ${
                            theme === 'dark'
                              ? 'hover:bg-gray-300'
                              : 'hover:bg-gray-500'
                          }`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteMyBacklink(backlink.id)}
                          className={`p-1.5 rounded hover:bg-opacity-10 ${
                            theme === 'dark'
                              ? 'hover:bg-red-300'
                              : 'hover:bg-red-500'
                          }`}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Link className="w-3 h-3" />
                          DA/DR
                        </p>
                        <p className="font-medium">
                          {backlink.da}/{backlink.dr}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <BarChart3 className="w-3 h-3" />
                          Tráfego/mês
                        </p>
                        <p className="font-medium">
                          {backlink.monthlyTraffic.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          Preço
                        </p>
                        <p className="font-medium">
                          R$ {backlink.price.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <button
                        onClick={() => toggleAvailability(backlink.id)}
                        className={`w-full px-3 py-1.5 rounded text-sm font-medium ${
                          backlink.available
                            ? theme === 'dark'
                              ? 'bg-green-900/30 text-green-400'
                              : 'bg-green-100 text-green-800'
                            : theme === 'dark'
                              ? 'bg-red-900/30 text-red-400'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {backlink.available ? 'Disponível' : 'Indisponível'}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Adicionar/Editar */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div 
              className="fixed inset-0 bg-black/50 transition-opacity"
              onClick={() => setIsModalOpen(false)}
            />
            
            <div className={`relative w-full max-w-md p-6 rounded-lg shadow-xl ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h2 className="text-xl font-bold mb-4">
                {selectedBacklink ? 'Editar Backlink' : 'Novo Backlink'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">URL do Site</label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={e => setFormData(prev => ({ ...prev, url: e.target.value }))}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    }`}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">DA</label>
                    <input
                      type="number"
                      value={formData.da}
                      onChange={e => setFormData(prev => ({ ...prev, da: Number(e.target.value) }))}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300'
                      }`}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">DR</label>
                    <input
                      type="number"
                      value={formData.dr}
                      onChange={e => setFormData(prev => ({ ...prev, dr: Number(e.target.value) }))}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300'
                      }`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Tráfego Mensal</label>
                  <input
                    type="number"
                    value={formData.monthlyTraffic}
                    onChange={e => setFormData(prev => ({ ...prev, monthlyTraffic: Number(e.target.value) }))}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Preço (R$)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Categoria</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    }`}
                    required
                    placeholder="Ex: Blog, Notícias, Tecnologia..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Descrição</label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    }`}
                    rows={3}
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className={`px-4 py-2 rounded-lg ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {selectedBacklink ? 'Salvar' : 'Adicionar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
