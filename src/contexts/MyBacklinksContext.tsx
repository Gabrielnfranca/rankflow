import React, { createContext, useContext, useState, useEffect } from 'react';

export interface MyBacklink {
  id: number;
  url: string;
  da: number;
  dr: number;
  monthlyTraffic: number;
  price: number;
  description: string;
  available: boolean;
  category: string;
}

interface MyBacklinksContextData {
  myBacklinks: MyBacklink[];
  addMyBacklink: (backlink: Omit<MyBacklink, 'id'>) => void;
  updateMyBacklink: (id: number, backlink: Partial<MyBacklink>) => void;
  deleteMyBacklink: (id: number) => void;
  toggleAvailability: (id: number) => void;
}

const MyBacklinksContext = createContext<MyBacklinksContextData>({} as MyBacklinksContextData);

export function MyBacklinksProvider({ children }: { children: React.ReactNode }) {
  const [myBacklinks, setMyBacklinks] = useState<MyBacklink[]>(() => {
    const saved = localStorage.getItem('my_backlinks');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('my_backlinks', JSON.stringify(myBacklinks));
  }, [myBacklinks]);

  const addMyBacklink = (backlink: Omit<MyBacklink, 'id'>) => {
    const newId = myBacklinks.length > 0 
      ? Math.max(...myBacklinks.map(b => b.id)) + 1 
      : 1;
    
    setMyBacklinks(prev => [...prev, { ...backlink, id: newId }]);
  };

  const updateMyBacklink = (id: number, backlink: Partial<MyBacklink>) => {
    setMyBacklinks(prev => 
      prev.map(b => b.id === id ? { ...b, ...backlink } : b)
    );
  };

  const deleteMyBacklink = (id: number) => {
    setMyBacklinks(prev => prev.filter(b => b.id !== id));
  };

  const toggleAvailability = (id: number) => {
    setMyBacklinks(prev => 
      prev.map(b => b.id === id ? { ...b, available: !b.available } : b)
    );
  };

  return (
    <MyBacklinksContext.Provider value={{
      myBacklinks,
      addMyBacklink,
      updateMyBacklink,
      deleteMyBacklink,
      toggleAvailability
    }}>
      {children}
    </MyBacklinksContext.Provider>
  );
}

export function useMyBacklinks() {
  const context = useContext(MyBacklinksContext);
  if (!context) {
    throw new Error('useMyBacklinks must be used within a MyBacklinksProvider');
  }
  return context;
}
