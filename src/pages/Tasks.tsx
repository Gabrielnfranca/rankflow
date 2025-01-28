import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  GripVertical,
  MoreVertical,
  Pencil,
  Trash2,
  Users,
  Calendar,
  Check
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { NewTaskModal } from '../components/NewTaskModal';
import { TaskViewModal } from '../components/TaskViewModal';
import { useFeed } from '../contexts/FeedContext';
import { useToast } from '../contexts/ToastContext';
import { useTasks } from '../contexts/TaskContext';

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
  created_at?: string;
}

const columns = [
  { 
    id: 'pendente' as const, 
    title: 'Pendentes', 
    icon: Clock, 
    iconColor: 'text-yellow-500',
    bgColor: {
      light: 'bg-yellow-50',
      dark: 'bg-yellow-900/10'
    }
  },
  { 
    id: 'em_progresso' as const, 
    title: 'Em Progresso', 
    icon: AlertCircle, 
    iconColor: 'text-blue-500',
    bgColor: {
      light: 'bg-blue-50',
      dark: 'bg-blue-900/10'
    }
  },
  { 
    id: 'concluida' as const, 
    title: 'Concluídas', 
    icon: CheckCircle2, 
    iconColor: 'text-green-500',
    bgColor: {
      light: 'bg-green-50',
      dark: 'bg-green-900/10'
    }
  }
];

export function Tasks() {
  const { theme } = useTheme();
  const { addFeedItem } = useFeed();
  const { showToast } = useToast();
  const { tasks, addTask, deleteTask, updateTask } = useTasks();
  const [isCreating, setIsCreating] = React.useState(false);

  const handleNewTask = async (taskData: Omit<Task, 'id' | 'status' | 'order'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        showToast('error', 'Você precisa estar logado para criar tarefas');
        return;
      }

      const pendingTasks = tasks.filter(t => t.status === 'pendente');
      const newTask = {
        status: 'pendente',
        order: pendingTasks.length,
        ...taskData,
        labels: taskData.labels || [],
        user_id: user.id
      };
      
      await addTask(newTask);
      
      addFeedItem({
        type: 'task_pending',
        taskTitle: newTask.title,
        clientId: 1,
        clientName: newTask.client,
        status: 'pendente'
      });

      showToast('success', 'Tarefa criada com sucesso!');
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      showToast('error', 'Erro ao criar tarefa');
    }
  };

  const handleDeleteTask = (taskId: number) => {
    const taskToDelete = tasks.find(t => t.id === taskId);
    if (taskToDelete) {
      deleteTask(taskId);
      
      addFeedItem({
        type: 'task_moved',
        taskTitle: taskToDelete.title,
        clientId: 1,
        clientName: taskToDelete.client,
        status: 'deleted'
      });
    }
  };

  const handleEditTask = (taskId: number, updatedData: Partial<Task>) => {
    updateTask(taskId, updatedData);
    
    const updatedTask = tasks.find(t => t.id === taskId);
    if (updatedTask) {
      addFeedItem({
        type: 'task_moved',
        taskTitle: updatedTask.title,
        clientId: 1,
        clientName: updatedTask.client,
        status: 'updated'
      });
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const taskId = parseInt(result.draggableId);
    const newStatus = result.destination.droppableId as 'pendente' | 'em_progresso' | 'concluida';
    const oldStatus = result.source.droppableId;
    
    const taskToMove = tasks.find(t => t.id === taskId);
    if (!taskToMove) return;

    try {
      // Atualiza o status da tarefa movida
      await updateTask(taskId, { 
        status: newStatus,
        order: result.destination.index
      });

      // Atualiza a ordem das outras tarefas na coluna de destino
      const tasksInDestination = tasks.filter(t => t.status === newStatus && t.id !== taskId);
      for (let i = 0; i < tasksInDestination.length; i++) {
        const task = tasksInDestination[i];
        const newOrder = i >= result.destination.index ? i + 1 : i;
        if (task.order !== newOrder) {
          await updateTask(task.id, { order: newOrder });
        }
      }

      // Atualiza a ordem das tarefas na coluna de origem se necessário
      if (oldStatus !== newStatus) {
        const tasksInSource = tasks.filter(t => t.status === oldStatus && t.id !== taskId);
        for (let i = 0; i < tasksInSource.length; i++) {
          const task = tasksInSource[i];
          if (task.order !== i) {
            await updateTask(task.id, { order: i });
          }
        }
      }

      const statusMap = {
        pendente: 'Tarefa movida para Pendentes',
        em_progresso: 'Tarefa movida para Em Progresso',
        concluida: 'Tarefa movida para Concluídas'
      };

      showToast('success', statusMap[newStatus]);
      
      addFeedItem({
        type: 'task_moved',
        taskTitle: taskToMove.title,
        clientId: 1,
        clientName: taskToMove.client,
        status: newStatus
      });
    } catch (error) {
      console.error('Erro ao mover tarefa:', error);
      showToast('error', 'Erro ao mover tarefa');
    }
  };

  const getColumnTasks = (status: Task['status']) => {
    return tasks
      .filter(task => task.status === status)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Tarefas
          </h1>
          <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Gerencie suas tarefas e projetos
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          Nova Tarefa
        </button>
      </div>

      {isCreating && (
        <NewTaskModal
          isOpen={isCreating}
          onClose={() => setIsCreating(false)}
          onSubmit={async (data) => {
            try {
              await handleNewTask(data);
              setIsCreating(false);
            } catch (error) {
              console.error('Erro ao criar tarefa:', error);
            }
          }}
        />
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {columns.map(column => {
            const columnTasks = getColumnTasks(column.id);
            
            return (
              <div
                key={column.id}
                className={`rounded-lg shadow-sm overflow-hidden ${
                  theme === 'dark' ? 'bg-[#2B2B2B]' : 'bg-white'
                }`}
              >
                <div className={`p-4 ${
                  theme === 'dark' ? column.bgColor.dark : column.bgColor.light
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <column.icon className={`w-5 h-5 ${column.iconColor}`} />
                      <h2 className="font-semibold">{column.title}</h2>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-sm ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                    }`}>
                      {columnTasks.length}
                    </span>
                  </div>
                </div>
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`p-4 space-y-3 min-h-[calc(100vh-300px)] transition-colors duration-200 ${
                        snapshot.isDraggingOver && theme === 'dark'
                          ? column.bgColor.dark
                          : snapshot.isDraggingOver
                          ? column.bgColor.light
                          : ''
                      }`}
                    >
                      {columnTasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={String(task.id)}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`transform transition-transform duration-200 ${
                                snapshot.isDragging ? 'rotate-2 scale-105' : ''
                              }`}
                            >
                              <TaskCard
                                task={task}
                                dragHandleProps={provided.dragHandleProps}
                                onDelete={handleDeleteTask}
                                onEdit={handleEditTask}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}

interface TaskCardProps {
  task: Task;
  dragHandleProps: any;
  onDelete: (id: number) => void;
  onEdit: (id: number, data: Partial<Task>) => void;
}

function getDeadlineStatus(deadline: string, time?: string) {
  const now = new Date();
  const taskDate = new Date(deadline + 'T00:00:00');
  
  if (time) {
    const [hours, minutes] = time.split(':');
    taskDate.setHours(parseInt(hours), parseInt(minutes));
  } else {
    taskDate.setHours(23, 59, 59);
  }

  const diffMinutes = (taskDate.getTime() - now.getTime()) / (1000 * 60);

  if (diffMinutes < 0) return 'expired';
  if (diffMinutes <= 60) return 'urgent';
  if (diffMinutes <= 72 * 60) return 'warning';
  return 'normal';
}

function TaskCard({ task, dragHandleProps, onDelete, onEdit }: TaskCardProps) {
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = React.useState(false);
  const [isViewing, setIsViewing] = React.useState(false);
  const [actionsOpen, setActionsOpen] = React.useState(false);
  const actionsRef = React.useRef<HTMLDivElement>(null);
  const deadlineStatus = getDeadlineStatus(task.deadline, task.time);

  const getDeadlineColor = () => {
    switch (deadlineStatus) {
      case 'expired':
        return theme === 'dark' ? 'text-red-400' : 'text-red-600';
      case 'urgent':
        return theme === 'dark' ? 'text-orange-400' : 'text-orange-600';
      case 'warning':
        return theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600';
      default:
        return theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const getDeadlineIndicator = () => {
    switch (deadlineStatus) {
      case 'expired':
        return 'Prazo expirado';
      case 'urgent':
        return 'Entrega em menos de 24h';
      case 'warning':
        return 'Entrega em menos de 72h';
      default:
        return '';
    }
  };

  return (
    <>
      <div 
        className={`group relative border rounded-lg p-4 ${
          theme === 'dark' 
            ? 'border-gray-700 hover:bg-[#3D3D3D]' 
            : 'border-gray-200 hover:bg-gray-50'
        } transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] cursor-pointer`}
        style={{ 
          opacity: isEditing ? 0.7 : 1,
          backgroundColor: theme === 'dark' ? '#333333' : 'white',
          borderLeftWidth: '4px',
          borderLeftColor: task.labels?.[0]?.color || (theme === 'dark' ? '#404040' : '#e5e7eb')
        }}
        onClick={() => setIsViewing(true)}
      >
        {/* Etiquetas no topo */}
        <div className="flex flex-wrap gap-1 mb-3">
          {task.labels?.map((label) => (
            <span
              key={label.id}
              className="px-2 py-0.5 rounded text-xs font-medium"
              style={{
                backgroundColor: label.color,
                color: '#FFFFFF',
                textShadow: '0px 1px 2px rgba(0, 0, 0, 0.2)'
              }}
            >
              {label.name}
            </span>
          ))}
        </div>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-medium mb-3">{task.title}</h3>
            
            {/* Informações do cliente */}
            <div className="flex items-center gap-2 mb-3">
              <span className={`flex items-center gap-1.5 text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <Users className="w-4 h-4" />
                {task.client}
              </span>
            </div>

            {/* Data e Hora */}
            <div className={`flex flex-col gap-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className={`${task.completedAt ? 'text-green-500' : getDeadlineColor()} font-medium`}>
                  {new Date(task.deadline + 'T00:00:00').toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
                {task.time && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span className={task.completedAt ? 'text-green-500' : getDeadlineColor()}>{task.time}</span>
                  </div>
                )}
              </div>
              
              {task.completedAt ? (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-green-50 border border-green-100 dark:bg-green-900/10 dark:border-green-900/20">
                  <Check className="w-4 h-4 text-green-500" />
                  <div className="flex flex-col">
                    <span className="font-medium text-green-700 dark:text-green-400">
                      Tarefa Concluída
                    </span>
                    <span className="text-xs text-green-600 dark:text-green-300">
                      Entregue em: {new Date(task.completedAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              ) : (
                deadlineStatus !== 'normal' && (
                  <div className={`flex items-center gap-2 p-2 rounded-lg ${
                    deadlineStatus === 'expired'
                      ? 'bg-red-50 border border-red-100 dark:bg-red-900/10 dark:border-red-900/20'
                      : deadlineStatus === 'urgent'
                      ? 'bg-orange-50 border border-orange-100 dark:bg-orange-900/10 dark:border-orange-900/20'
                      : 'bg-yellow-50 border border-yellow-100 dark:bg-yellow-900/10 dark:border-yellow-900/20'
                  }`}>
                    {deadlineStatus === 'expired' ? (
                      <AlertCircle className={`w-4 h-4 ${
                        theme === 'dark' ? 'text-red-400' : 'text-red-500'
                      }`} />
                    ) : deadlineStatus === 'urgent' ? (
                      <Clock className={`w-4 h-4 ${
                        theme === 'dark' ? 'text-orange-400' : 'text-orange-500'
                      }`} />
                    ) : (
                      <AlertCircle className={`w-4 h-4 ${
                        theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'
                      }`} />
                    )}
                    <div className="flex flex-col">
                      <span className={`font-medium ${
                        deadlineStatus === 'expired'
                          ? theme === 'dark' ? 'text-red-400' : 'text-red-700'
                          : deadlineStatus === 'urgent'
                          ? theme === 'dark' ? 'text-orange-400' : 'text-orange-700'
                          : theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700'
                      }`}>
                        {deadlineStatus === 'expired'
                          ? 'Prazo Expirado'
                          : deadlineStatus === 'urgent'
                          ? 'Entrega Urgente'
                          : 'Atenção ao Prazo'}
                      </span>
                      <span className={`text-xs ${
                        deadlineStatus === 'expired'
                          ? theme === 'dark' ? 'text-red-300' : 'text-red-600'
                          : deadlineStatus === 'urgent'
                          ? theme === 'dark' ? 'text-orange-300' : 'text-orange-600'
                          : theme === 'dark' ? 'text-yellow-300' : 'text-yellow-600'
                      }`}>
                        {deadlineStatus === 'expired'
                          ? 'Esta tarefa está atrasada'
                          : deadlineStatus === 'urgent'
                          ? 'Entrega em menos de 1 hora'
                          : 'Entrega em menos de 72 horas'}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
            
            {/* Prioridade e Tipo */}
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                task.priority === 'Alta' 
                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' 
                  : task.priority === 'Média' 
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' 
                    : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              }`}>
                {task.priority}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                theme === 'dark' 
                  ? 'bg-gray-800 text-gray-300' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {task.type}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing p-1">
              <GripVertical className="w-4 h-4 text-gray-400" />
            </div>
            
            <div className="relative" ref={actionsRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActionsOpen(!actionsOpen);
                }}
                className={`p-1 rounded-lg transition-colors ${
                  actionsOpen
                    ? theme === 'dark'
                      ? 'bg-gray-700 text-gray-200'
                      : 'bg-gray-200 text-gray-700'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {actionsOpen && (
                <div className={`absolute right-0 mt-1 w-36 rounded-lg shadow-lg py-1 z-10 ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border border-gray-700' 
                    : 'bg-white border border-gray-200'
                }`}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(true);
                      setActionsOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm flex items-center ${
                      theme === 'dark'
                        ? 'hover:bg-gray-700'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Editar
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(task.id);
                      setActionsOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm flex items-center text-red-600 ${
                      theme === 'dark'
                        ? 'hover:bg-gray-700'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isViewing && (
        <TaskViewModal
          isOpen={isViewing}
          onClose={() => setIsViewing(false)}
          task={task}
          onEdit={() => {
            setIsViewing(false);
            setIsEditing(true);
          }}
        />
      )}

      {isEditing && (
        <NewTaskModal
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          onSubmit={(data) => {
            onEdit(task.id, {
              ...data,
              id: task.id,
              status: task.status,
              order: task.order
            });
            setIsEditing(false);
          }}
          initialData={{
            ...task,
            deadline: task.deadline || '',
            time: task.time || ''
          }}
        />
      )}
    </>
  );
}