import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Client {
  id: number;
  name: string;
  website: string;
  email: string;
  status: string;
  progress: number;
}

interface ClientContextType {
  clients: Client[];
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (id: number, updates: Partial<Client>) => void;
  deleteClient: (id: number) => void;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

const INITIAL_CLIENTS: Client[] = [];

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients));
  }, [clients]);

  const addClient = (client: Omit<Client, 'id'>) => {
    const newId = Math.max(0, ...clients.map(c => c.id)) + 1;
    setClients(prev => [...prev, { ...client, id: newId, website: '', email: '', status: '', progress: 0 }]);
  };

  const updateClient = (id: number, updates: Partial<Client>) => {
    setClients(prev =>
      prev.map(client =>
        client.id === id ? { ...client, ...updates } : client
      )
    );
  };

  const deleteClient = (id: number) => {
    setClients(prev => prev.filter(client => client.id !== id));
  };

  return (
    <ClientContext.Provider
      value={{
        clients,
        addClient,
        updateClient,
        deleteClient,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
}

export function useClients() {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error('useClients must be used within a ClientProvider');
  }
  return context;
}
