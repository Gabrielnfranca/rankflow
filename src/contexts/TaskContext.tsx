import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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
  userId: string; 
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (id: number, updates: Partial<Task>) => void;
  deleteTask: (id: number) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const loadTasks = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('userId', user.id)
        .order('order');

      if (error) {
        console.error('Erro ao carregar tarefas:', error);
        return;
      }

      setTasks(data || []);
    };

    loadTasks();
  }, []);

  const addTask = async (task: Task) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('tasks')
      .insert([{ ...task, userId: user.id }])
      .select()
      .single();

    if (error) {
      console.error('Erro ao adicionar tarefa:', error);
      return;
    }

    if (data) {
      setTasks(prev => [...prev, data]);
    }
  };

  const updateTask = async (id: number, updates: Partial<Task>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .eq('userId', user.id); 

    if (error) {
      console.error('Erro ao atualizar tarefa:', error);
      return;
    }

    setTasks(prev =>
      prev.map(task => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const deleteTask = async (id: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('userId', user.id); 

    if (error) {
      console.error('Erro ao deletar tarefa:', error);
      return;
    }

    setTasks(prev => prev.filter(task => task.id !== id));
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
