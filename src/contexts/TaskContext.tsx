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
      if (!user) {
        console.log('Usuário não autenticado');
        return;
      }

      console.log('Carregando tarefas para usuário:', user.id);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('userId', user.id)
        .order('order');

      if (error) {
        console.error('Erro ao carregar tarefas:', error);
        return;
      }

      console.log('Tarefas carregadas:', data);
      setTasks(data || []);
    };

    // Carregar tarefas iniciais
    loadTasks();

    // Configurar realtime subscription
    const channel = supabase
      .channel('tasks_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks'
        },
        async (payload) => {
          console.log('Mudança detectada:', payload);
          // Recarregar todas as tarefas quando houver mudança
          loadTasks();
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      channel.unsubscribe();
    };
  }, []);

  const addTask = async (task: Task) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('Usuário não autenticado ao adicionar tarefa');
      return;
    }

    console.log('Adicionando tarefa:', { ...task, userId: user.id });
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ ...task, userId: user.id }])
      .select()
      .single();

    if (error) {
      console.error('Erro ao adicionar tarefa:', error);
      return;
    }

    console.log('Tarefa adicionada com sucesso:', data);
    if (data) {
      setTasks(prev => [...prev, data]);
    }
  };

  const updateTask = async (id: number, updates: Partial<Task>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('Usuário não autenticado ao atualizar tarefa');
      return;
    }

    console.log('Atualizando tarefa:', id, updates);
    const { error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .eq('userId', user.id); 

    if (error) {
      console.error('Erro ao atualizar tarefa:', error);
      return;
    }

    console.log('Tarefa atualizada com sucesso:', id);
    setTasks(prev =>
      prev.map(task => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const deleteTask = async (id: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('Usuário não autenticado ao deletar tarefa');
      return;
    }

    console.log('Deletando tarefa:', id);
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('userId', user.id); 

    if (error) {
      console.error('Erro ao deletar tarefa:', error);
      return;
    }

    console.log('Tarefa deletada com sucesso:', id);
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
