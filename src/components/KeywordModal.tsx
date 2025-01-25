import React, { useState } from 'react';
import { Modal } from './Modal';
import { useTheme } from '../contexts/ThemeContext';
import { useKeywords } from '../contexts/KeywordContext';
import { Search, Plus, Pencil, Trash2, X, TrendingUp, BarChart2 } from 'lucide-react';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

interface KeywordModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: number;
}

export function KeywordModal({ isOpen, onClose, clientId }: KeywordModalProps) {
  const { theme } = useTheme();
  const { addKeyword, getClientKeywords, addKeywordHistory, deleteKeyword } = useKeywords();
  const [newKeyword, setNewKeyword] = useState('');
  const [initialPosition, setInitialPosition] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKeyword, setSelectedKeyword] = useState<number | null>(null);
  const [newPosition, setNewPosition] = useState('');
  const [newTraffic, setNewTraffic] = useState('');
  const clientKeywords = getClientKeywords(clientId);

  const handleAddKeyword = () => {
    if (!newKeyword.trim() || !initialPosition) return;

    const position = parseInt(initialPosition);
    if (isNaN(position)) return;

    console.log('Adicionando palavra-chave:', newKeyword);

    const keyword = {
      clientId,
      term: newKeyword.trim(),
      volume: 0,
      position: position,
      previousPosition: position,
      lastUpdated: new Date().toISOString()
    };

    addKeyword(keyword);
    setNewKeyword('');
    setInitialPosition('');
  };

  const handleUpdateKeyword = (keywordId: number) => {
    if (!newPosition || !newTraffic) return;

    const position = parseInt(newPosition);
    const traffic = parseInt(newTraffic);

    if (isNaN(position) || isNaN(traffic)) return;

    addKeywordHistory(keywordId, {
      position: position,
      traffic: traffic
    });

    setSelectedKeyword(null);
    setNewPosition('');
    setNewTraffic('');
  };

  const handleDeleteKeyword = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta palavra-chave?')) {
      deleteKeyword(id);
    }
  };

  const filteredKeywords = clientKeywords.filter(keyword =>
    keyword.term.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedKeywords = [...filteredKeywords].sort((a, b) => a.ranking - b.ranking);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Gerenciar Palavras-chave">
      <div className={`p-4 md:p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        {/* Adicionar nova palavra-chave */}
        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            placeholder="Digite uma nova palavra-chave"
            className={`flex-1 px-4 py-2 rounded-lg border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300'
            }`}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && initialPosition) handleAddKeyword();
            }}
          />
          <input
            type="number"
            value={initialPosition}
            onChange={(e) => setInitialPosition(e.target.value)}
            placeholder="Posição atual"
            className={`w-32 px-4 py-2 rounded-lg border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300'
            }`}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && newKeyword) handleAddKeyword();
            }}
          />
          <button
            type="button"
            onClick={handleAddKeyword}
            disabled={!newKeyword.trim() || !initialPosition}
            className={`px-4 py-2 rounded-lg flex items-center justify-center ${
              !newKeyword.trim() || !initialPosition
                ? 'opacity-50 cursor-not-allowed'
                : ''
            } ${
              theme === 'dark'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
          </button>
        </div>

        {/* Barra de pesquisa */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar palavras-chave..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-10 pr-4 py-2 border rounded-lg w-full ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300'
            }`}
          />
        </div>

        {/* Lista de palavras-chave */}
        <div className="overflow-x-auto">
          <div className={`rounded-lg border min-w-[800px] ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <table className="w-full">
              <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Ranking
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Palavra-chave
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Posição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Volume
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Última Atualização
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${
                theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'
              }`}>
                {sortedKeywords.map((keyword) => (
                  <React.Fragment key={keyword.id}>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          keyword.ranking <= 3
                            ? 'bg-green-100 text-green-800'
                            : keyword.ranking <= 10
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          #{keyword.ranking}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{keyword.term}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`${
                            keyword.position < keyword.previousPosition
                              ? 'text-green-500'
                              : keyword.position > keyword.previousPosition
                              ? 'text-red-500'
                              : ''
                          }`}>
                            {keyword.position}
                          </span>
                          {keyword.position !== keyword.previousPosition && (
                            <span className="text-xs ml-2">
                              ({keyword.position < keyword.previousPosition ? '+' : ''}
                              {keyword.previousPosition - keyword.position})
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {keyword.volume.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {format(new Date(keyword.lastUpdated), "dd 'de' MMMM", { locale: ptBR })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedKeyword(selectedKeyword === keyword.id ? null : keyword.id)}
                            className={`p-2 rounded-lg text-sm ${
                              theme === 'dark'
                                ? 'hover:bg-gray-700'
                                : 'hover:bg-gray-100'
                            }`}
                            title="Atualizar Posição e Volume"
                          >
                            <TrendingUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setSelectedKeyword(selectedKeyword === keyword.id ? null : keyword.id)}
                            className={`p-2 rounded-lg text-sm ${
                              theme === 'dark'
                                ? 'hover:bg-gray-700'
                                : 'hover:bg-gray-100'
                            }`}
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteKeyword(keyword.id)}
                            className={`p-2 rounded-lg text-sm text-red-500 ${
                              theme === 'dark'
                                ? 'hover:bg-gray-700'
                                : 'hover:bg-gray-100'
                            }`}
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {selectedKeyword === keyword.id && (
                      <tr className={theme === 'dark' ? 'bg-gray-750' : 'bg-gray-50'}>
                        <td colSpan={6} className="px-6 py-4">
                          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Nova Posição
                              </label>
                              <input
                                type="number"
                                value={newPosition}
                                onChange={(e) => setNewPosition(e.target.value)}
                                className={`w-full sm:w-24 px-3 py-1 rounded-lg border ${
                                  theme === 'dark'
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-white border-gray-300'
                                }`}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Tráfego
                              </label>
                              <input
                                type="number"
                                value={newTraffic}
                                onChange={(e) => setNewTraffic(e.target.value)}
                                className={`w-full sm:w-24 px-3 py-1 rounded-lg border ${
                                  theme === 'dark'
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-white border-gray-300'
                                }`}
                              />
                            </div>
                            <button
                              onClick={() => handleUpdateKeyword(keyword.id)}
                              className="w-full sm:w-auto mt-4 sm:mt-6 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                            >
                              Atualizar
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Modal>
  );
}
