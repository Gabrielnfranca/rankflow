import React, { createContext, useContext, useState, useEffect } from 'react';

interface Task {
  id: number;
  title: string;
  client: string;
  deadline: string;
  priority: 'Alta' | 'Média' | 'Baixa';
  status: 'pendente' | 'em_progresso' | 'concluida';
  type: 'SEO Técnico' | 'Keyword Research' | 'Backlinks' | 'Conteúdo';
  description?: string;
  order?: number;
  labels?: Array<{ id: number; name: string; color: string }>;
  color?: string;
  time?: string;
  completedAt?: string;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (id: number, updates: Partial<Task>) => void;
  deleteTask: (id: number) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const INITIAL_TASKS: Task[] = [
  {
    id: 1,
    title: 'Análise Técnica - Cliente A',
    client: 'Cliente A',
    deadline: '2024-03-20',
    priority: 'Alta',
    status: 'pendente',
    type: 'SEO Técnico',
    order: 0
  },
  {
    id: 2,
    title: 'Pesquisa de Palavras-chave - Cliente B',
    client: 'Cliente B',
    deadline: '2024-03-25',
    priority: 'Média',
    status: 'em_progresso',
    type: 'Keyword Research',
    order: 0
  },
  {
    id: 3,
    title: 'Prospecção de Backlinks - Cliente C',
    client: 'Cliente C',
    deadline: '2024-03-18',
    priority: 'Baixa',
    status: 'concluida',
    type: 'Backlinks',
    order: 0
  },
];

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task: Task) => {
    setTasks(prev => [...prev, task]);
  };

  const updateTask = (id: number, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === id) {
          if (updates.status === 'concluida') {
            return {
              ...task,
              ...updates,
              completedAt: new Date().toISOString()
            };
          }
          return { ...task, ...updates, completedAt: undefined };
        }
        return task;
      })
    );
  };

  const deleteTask = (id: number) => {
    setTasks(prev => {
      const taskToDelete = prev.find(t => t.id === id);
      if (!taskToDelete) return prev;
      
      const filteredTasks = prev.filter(task => task.id !== id);
      // Reorder remaining tasks in the same status
      return filteredTasks.map((task, index) => {
        if (task.status === taskToDelete.status) {
          return { ...task, order: index };
        }
        return task;
      });
    });
  };

  return (
    <TaskContext.Provider 
      value={{ tasks, addTask, updateTask, deleteTask }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
