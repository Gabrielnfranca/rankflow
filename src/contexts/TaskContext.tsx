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
  user_id: string; 
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: number, updates: Partial<Task>) => void;
  deleteTask: (id: number) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.error('Erro: Você precisa estar logado para visualizar tarefas');
          return;
        }

        console.log('Carregando tarefas para usuário:', user.id);
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id)
          .order('order', { ascending: true });

        if (error) {
          console.error('Erro ao carregar tarefas:', error);
          return;
        }

        console.log('Tarefas carregadas:', data);
        setTasks(data || []);
      } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
      }
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
        (payload) => {
          console.log('Mudança detectada:', payload);
          loadTasks(); // Recarrega todas as tarefas quando houver mudança
        }
      )
      .subscribe((status) => {
        console.log('Status da subscription:', status);
      });

    // Cleanup subscription
    return () => {
      console.log('Limpando subscription');
      channel.unsubscribe();
    };
  }, []);

  const addTask = async (task: Omit<Task, 'id'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Você precisa estar logado para criar tarefas');
      }

      console.log('Iniciando criação de tarefa:', task);

      // Garante que a ordem está correta
      const { data: existingTasks } = await supabase
        .from('tasks')
        .select('order')
        .eq('status', task.status)
        .eq('user_id', user.id)
        .order('order', { ascending: true });

      const order = existingTasks?.length || 0;

      const newTask = {
        ...task,
        user_id: user.id,
        order,
        created_at: new Date().toISOString()
      };

      console.log('Enviando nova tarefa para o Supabase:', newTask);

      const { data, error } = await supabase
        .from('tasks')
        .insert([newTask])
        .select()
        .single();

      if (error) {
        console.error('Erro do Supabase ao criar tarefa:', error);
        throw error;
      }

      console.log('Tarefa criada com sucesso:', data);

      setTasks(prev => [...prev, data].sort((a, b) => (a.order || 0) - (b.order || 0)));

      return data;
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
      throw error;
    }
  };

  const updateTask = async (id: number, updates: Partial<Task>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Você precisa estar logado para atualizar tarefas');
      }

      const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setTasks(prev =>
        prev.map(task => (task.id === id ? { ...task, ...updates } : task))
           .sort((a, b) => (a.order || 0) - (b.order || 0))
      );
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      throw error;
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Você precisa estar logado para deletar tarefas');
      }

      const taskToDelete = tasks.find(t => t.id === id);
      if (!taskToDelete) throw new Error('Tarefa não encontrada');

      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Atualiza a ordem das tarefas restantes
      const tasksInSameStatus = tasks.filter(t => 
        t.status === taskToDelete.status && t.id !== id
      );

      for (let i = 0; i < tasksInSameStatus.length; i++) {
        const task = tasksInSameStatus[i];
        if (task.order !== i) {
          await updateTask(task.id, { order: i });
        }
      }

      setTasks(prev => 
        prev.filter(task => task.id !== id)
           .sort((a, b) => (a.order || 0) - (b.order || 0))
      );
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      throw error;
    }
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
