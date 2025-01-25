import React, { createContext, useContext, useState, useEffect } from 'react';

interface KeywordHistory {
  date: string;
  position: number;
  traffic: number;
}

interface Keyword {
  id: number;
  clientId: number;
  term: string;
  volume: number;
  position: number;
  previousPosition: number;
  lastUpdated: string;
  history: KeywordHistory[];
  ranking: number;
}

interface KeywordContextType {
  keywords: Keyword[];
  addKeyword: (keyword: Omit<Keyword, 'id' | 'lastUpdated' | 'history' | 'ranking'>) => void;
  updateKeyword: (id: number, updates: Partial<Omit<Keyword, 'history' | 'ranking'>>) => void;
  deleteKeyword: (id: number) => void;
  getClientKeywords: (clientId: number) => Keyword[];
  addKeywordHistory: (id: number, history: Omit<KeywordHistory, 'date'>) => void;
  getKeywordHistory: (id: number) => KeywordHistory[];
}

const KeywordContext = createContext<KeywordContextType | undefined>(undefined);

export function KeywordProvider({ children }: { children: React.ReactNode }) {
  const [keywords, setKeywords] = useState<Keyword[]>(() => {
    const saved = localStorage.getItem('keywords');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('keywords', JSON.stringify(keywords));
  }, [keywords]);

  const updateRankings = (clientId: number) => {
    const clientKeywords = keywords.filter(k => k.clientId === clientId);
    const sortedKeywords = [...clientKeywords].sort((a, b) => {
      // Primeiro critério: melhor posição
      const positionDiff = a.position - b.position;
      if (positionDiff !== 0) return positionDiff;
      
      // Segundo critério: maior melhoria em relação à posição anterior
      const aImprovement = a.previousPosition - a.position;
      const bImprovement = b.previousPosition - b.position;
      if (aImprovement !== bImprovement) return bImprovement - aImprovement;
      
      // Terceiro critério: maior volume de tráfego
      return b.volume - a.volume;
    });

    setKeywords(prev => prev.map(keyword => {
      if (keyword.clientId !== clientId) return keyword;
      const rank = sortedKeywords.findIndex(k => k.id === keyword.id) + 1;
      return { ...keyword, ranking: rank };
    }));
  };

  const addKeyword = (keyword: Omit<Keyword, 'id' | 'lastUpdated' | 'history' | 'ranking'>) => {
    const newId = Math.max(0, ...keywords.map(k => k.id)) + 1;
    const newKeyword = {
      ...keyword,
      id: newId,
      lastUpdated: new Date().toISOString(),
      history: [],
      ranking: keywords.filter(k => k.clientId === keyword.clientId).length + 1
    };

    setKeywords(prev => [...prev, newKeyword]);
  };

  const updateKeyword = (id: number, updates: Partial<Omit<Keyword, 'history' | 'ranking'>>) => {
    setKeywords(prev => {
      const newKeywords = prev.map(keyword =>
        keyword.id === id
          ? {
              ...keyword,
              ...updates,
              lastUpdated: new Date().toISOString()
            }
          : keyword
      );

      // Se a posição foi atualizada, atualiza os rankings
      if ('position' in updates) {
        const clientId = newKeywords.find(k => k.id === id)?.clientId;
        if (clientId) {
          const clientKeywords = newKeywords.filter(k => k.clientId === clientId);
          const sortedKeywords = [...clientKeywords].sort((a, b) => {
            const positionDiff = a.position - b.position;
            if (positionDiff !== 0) return positionDiff;
            return b.volume - a.volume;
          });

          return newKeywords.map(keyword => {
            if (keyword.clientId !== clientId) return keyword;
            const rank = sortedKeywords.findIndex(k => k.id === keyword.id) + 1;
            return { ...keyword, ranking: rank };
          });
        }
      }

      return newKeywords;
    });
  };

  const addKeywordHistory = (id: number, historyEntry: Omit<KeywordHistory, 'date'>) => {
    setKeywords(prev => {
      const keyword = prev.find(k => k.id === id);
      if (!keyword) return prev;

      const newHistory = {
        ...historyEntry,
        date: new Date().toISOString()
      };

      const updatedKeyword = {
        ...keyword,
        position: historyEntry.position,
        previousPosition: keyword.position,
        volume: historyEntry.traffic,
        history: [...keyword.history, newHistory],
        lastUpdated: new Date().toISOString()
      };

      const newKeywords = prev.map(k => k.id === id ? updatedKeyword : k);
      
      // Atualiza os rankings após adicionar histórico
      const clientKeywords = newKeywords.filter(k => k.clientId === keyword.clientId);
      const sortedKeywords = [...clientKeywords].sort((a, b) => {
        const positionDiff = a.position - b.position;
        if (positionDiff !== 0) return positionDiff;
        return b.volume - a.volume;
      });

      return newKeywords.map(k => {
        if (k.clientId !== keyword.clientId) return k;
        const rank = sortedKeywords.findIndex(kw => kw.id === k.id) + 1;
        return { ...k, ranking: rank };
      });
    });
  };

  const getKeywordHistory = (id: number) => {
    const keyword = keywords.find(k => k.id === id);
    return keyword?.history || [];
  };

  const deleteKeyword = (id: number) => {
    setKeywords(prev => {
      const keywordToDelete = prev.find(k => k.id === id);
      if (!keywordToDelete) return prev;

      const newKeywords = prev.filter(keyword => keyword.id !== id);
      
      // Atualiza os rankings após deletar
      const clientKeywords = newKeywords.filter(k => k.clientId === keywordToDelete.clientId);
      const sortedKeywords = [...clientKeywords].sort((a, b) => {
        const positionDiff = a.position - b.position;
        if (positionDiff !== 0) return positionDiff;
        return b.volume - a.volume;
      });

      return newKeywords.map(keyword => {
        if (keyword.clientId !== keywordToDelete.clientId) return keyword;
        const rank = sortedKeywords.findIndex(k => k.id === keyword.id) + 1;
        return { ...keyword, ranking: rank };
      });
    });
  };

  const getClientKeywords = (clientId: number) => {
    return keywords.filter(keyword => keyword.clientId === clientId);
  };

  return (
    <KeywordContext.Provider
      value={{
        keywords,
        addKeyword,
        updateKeyword,
        deleteKeyword,
        getClientKeywords,
        addKeywordHistory,
        getKeywordHistory
      }}
    >
      {children}
    </KeywordContext.Provider>
  );
}

export function useKeywords() {
  const context = useContext(KeywordContext);
  if (context === undefined) {
    throw new Error('useKeywords must be used within a KeywordProvider');
  }
  return context;
}
