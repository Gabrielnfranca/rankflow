import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Backlink {
  id: number;
  client: string;
  url: string;
  targetUrl: string;
  da: number; // Domain Authority
  dr: number; // Domain Rating
  price: number;
  status: 'prospectado' | 'negociacao' | 'aprovado' | 'publicado' | 'recusado';
  paymentStatus: 'pendente' | 'pago';
  dateProspected: string;
  datePublished?: string;
  notes?: string;
}

interface BacklinkContextType {
  backlinks: Backlink[];
  addBacklink: (backlink: Omit<Backlink, 'id'>) => void;
  updateBacklink: (id: number, updates: Partial<Backlink>) => void;
  deleteBacklink: (id: number) => void;
  getClientExpenses: (client: string) => number;
  getClientBacklinks: (client: string) => Backlink[];
}

const BacklinkContext = createContext<BacklinkContextType | undefined>(undefined);

const INITIAL_BACKLINKS: Backlink[] = [
  {
    id: 1,
    client: 'Tech Solutions',
    url: 'https://techblog.com',
    targetUrl: 'https://techsolutions.com/product',
    da: 45,
    dr: 52,
    price: 500,
    status: 'publicado',
    paymentStatus: 'pago',
    dateProspected: '2024-01-15',
    datePublished: '2024-01-20',
    notes: 'Blog de tecnologia com boa autoridade'
  },
  {
    id: 2,
    client: 'Green Energy',
    url: 'https://sustainablenews.com',
    targetUrl: 'https://greenenergy.com/solar',
    da: 38,
    dr: 44,
    price: 350,
    status: 'aprovado',
    paymentStatus: 'pendente',
    dateProspected: '2024-01-18',
    notes: 'Site focado em sustentabilidade'
  }
];

export function BacklinkProvider({ children }: { children: React.ReactNode }) {
  const [backlinks, setBacklinks] = useState<Backlink[]>(() => {
    const saved = localStorage.getItem('backlinks');
    return saved ? JSON.parse(saved) : INITIAL_BACKLINKS;
  });

  useEffect(() => {
    localStorage.setItem('backlinks', JSON.stringify(backlinks));
  }, [backlinks]);

  const addBacklink = (backlink: Omit<Backlink, 'id'>) => {
    const newId = Math.max(0, ...backlinks.map(b => b.id)) + 1;
    setBacklinks(prev => [...prev, { ...backlink, id: newId }]);
  };

  const updateBacklink = (id: number, updates: Partial<Backlink>) => {
    setBacklinks(prev =>
      prev.map(backlink =>
        backlink.id === id ? { ...backlink, ...updates } : backlink
      )
    );
  };

  const deleteBacklink = (id: number) => {
    setBacklinks(prev => prev.filter(backlink => backlink.id !== id));
  };

  const getClientExpenses = (client: string) => {
    return backlinks
      .filter(b => b.client === client && b.status !== 'recusado')
      .reduce((total, b) => total + b.price, 0);
  };

  const getClientBacklinks = (client: string) => {
    return backlinks.filter(b => b.client === client);
  };

  return (
    <BacklinkContext.Provider
      value={{
        backlinks,
        addBacklink,
        updateBacklink,
        deleteBacklink,
        getClientExpenses,
        getClientBacklinks
      }}
    >
      {children}
    </BacklinkContext.Provider>
  );
}

export function useBacklinks() {
  const context = useContext(BacklinkContext);
  if (context === undefined) {
    throw new Error('useBacklinks must be used within a BacklinkProvider');
  }
  return context;
}
