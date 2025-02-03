import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Task } from '../types/Task';

interface TaskContextData {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  addTask: (task: Omit<Task, 'id' | 'created_at'>) => Promise<Task>;
  updateTask: (id: number, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  reorderTasks: (taskId: number, newOrder: number) => Promise<void>;
}

const TaskContext = createContext<TaskContextData | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    console.log('Setting up tasks context...');

    async function loadTasks() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          if (mounted) {
            setTasks([]);
            setLoading(false);
          }
          return;
        }

        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (tasksError) {
          console.error('Erro ao carregar tarefas:', tasksError);
          if (mounted) {
            setError('Erro ao carregar tarefas');
            setLoading(false);
          }
          return;
        }

        if (mounted) {
          setTasks(tasksData || []);
          setError(null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Erro ao inicializar:', error);
        if (mounted) {
          setError('Erro ao carregar tarefas');
          setLoading(false);
        }
      }
    }

    loadTasks();

    const subscription = supabase
      .channel('tasks_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'tasks',
        filter: `user_id=eq.${supabase.auth.getSession().then(({ data }) => data.session?.user?.id)}`
      }, (payload) => {
        console.log('Change received!', payload);
        loadTasks();
      })
      .subscribe();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const addTask = async (task: Omit<Task, 'id' | 'created_at'>): Promise<Task> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) throw new Error('Usuário não autenticado');

      const newTask = {
        ...task,
        user_id: session.user.id,
        status: task.status || 'pendente',
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert([newTask])
        .select()
        .single();

      if (error) throw error;
      
      setTasks(current => [data, ...current]);
      return data;
    } catch (error: any) {
      console.error('Erro ao adicionar tarefa:', error);
      throw error;
    }
  };

  const updateTask = async (id: number, task: Partial<Task>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          ...task,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setTasks(current => current.map(t => t.id === id ? { ...t, ...data } : t));
    } catch (error: any) {
      console.error('Erro ao atualizar tarefa:', error);
      throw error;
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTasks(current => current.filter(t => t.id !== id));
    } catch (error: any) {
      console.error('Erro ao deletar tarefa:', error);
      throw error;
    }
  };

  const reorderTasks = async (taskId: number, newOrder: number) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ order: newOrder })
        .eq('id', taskId);

      if (error) throw error;
      setTasks(current => {
        const updated = current.map(t => {
          if (t.id === taskId) return { ...t, order: newOrder };
          return t;
        });
        return updated.sort((a, b) => (a.order || 0) - (b.order || 0));
      });
    } catch (error: any) {
      console.error('Erro ao reordenar tarefa:', error);
      throw error;
    }
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      loading,
      error,
      addTask,
      updateTask,
      deleteTask,
      reorderTasks
    }}>
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
