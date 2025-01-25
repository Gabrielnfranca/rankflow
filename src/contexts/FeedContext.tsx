import React, { createContext, useContext, useState } from 'react';

interface FeedItem {
  id: number;
  type: 'task_completed' | 'task_pending' | 'task_moved';
  taskTitle: string;
  clientId: number;
  clientName: string;
  timestamp: string;
  status?: string;
}

interface FeedContextType {
  addFeedItem: (item: Omit<FeedItem, 'id' | 'timestamp'>) => void;
  getFeedByClient: (clientId: number) => FeedItem[];
  getAllFeed: () => FeedItem[];
}

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export function FeedProvider({ children }: { children: React.ReactNode }) {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);

  const addFeedItem = (item: Omit<FeedItem, 'id' | 'timestamp'>) => {
    const newItem: FeedItem = {
      ...item,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    };
    setFeedItems(prev => [newItem, ...prev]);
  };

  const getFeedByClient = (clientId: number) => {
    return feedItems.filter(item => item.clientId === clientId);
  };

  const getAllFeed = () => feedItems;

  return (
    <FeedContext.Provider value={{ addFeedItem, getFeedByClient, getAllFeed }}>
      {children}
    </FeedContext.Provider>
  );
}

export function useFeed() {
  const context = useContext(FeedContext);
  if (context === undefined) {
    throw new Error('useFeed must be used within a FeedProvider');
  }
  return context;
}