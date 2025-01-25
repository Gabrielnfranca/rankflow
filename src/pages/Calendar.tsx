import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useTheme } from '../contexts/ThemeContext';
import { useTasks } from '../contexts/TaskContext';

interface CalendarEvent {
  id: number;
  title: string;
  date: Date;
  type: 'task' | 'deadline' | 'meeting';
  client?: string;
  description?: string;
  taskId?: number;
}

export function Calendar() {
  const { theme } = useTheme();
  const { tasks } = useTasks();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Gerenciar eventos do calendário
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('calendar_events');
    const savedEvents = saved ? JSON.parse(saved) : [];
    return savedEvents.map((event: any) => ({
      ...event,
      date: new Date(event.date)
    }));
  });

  // Sincronizar tarefas com eventos do calendário
  useEffect(() => {
    // Converter tarefas em eventos
    const taskEvents = tasks.map(task => ({
      id: task.id,
      title: task.title,
      date: new Date(task.deadline),
      type: 'task' as const,
      client: task.client,
      description: task.description,
      taskId: task.id
    }));

    // Manter apenas eventos que não são tarefas
    const nonTaskEvents = events.filter(event => !event.taskId);

    // Combinar eventos não-tarefa com eventos de tarefa
    const newEvents = [...nonTaskEvents, ...taskEvents];
    
    setEvents(newEvents);
    localStorage.setItem('calendar_events', JSON.stringify(newEvents));
  }, [tasks]);

  const [newEvent, setNewEvent] = useState<Omit<CalendarEvent, 'id'>>({
    title: '',
    date: new Date(),
    type: 'deadline',
    client: '',
    description: ''
  });

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = Math.max(0, ...events.map(e => e.id)) + 1;
    const event = { ...newEvent, id: newId };
    const updatedEvents = [...events, event];
    setEvents(updatedEvents);
    localStorage.setItem('calendar_events', JSON.stringify(updatedEvents));
    setIsModalOpen(false);
    setNewEvent({
      title: '',
      date: new Date(),
      type: 'deadline',
      client: '',
      description: ''
    });
  };

  const getDayEvents = (date: Date) => events.filter(event => isSameDay(new Date(event.date), date));

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const getEventColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'task': return 'bg-green-500';
      case 'deadline': return 'bg-red-500';
      case 'meeting': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Calendário</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-lg font-medium">
              {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
            </span>
            <button
              onClick={handleNextMonth}
              className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Novo Evento
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div
            key={day}
            className={`p-4 text-center font-medium ${
              theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-600'
            }`}
          >
            {day}
          </div>
        ))}
        
        {days.map(day => {
          const dayEvents = getDayEvents(day);
          const isToday = isSameDay(day, new Date());
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          
          return (
            <div
              key={day.toISOString()}
              onClick={() => setSelectedDate(day)}
              className={`min-h-[120px] p-2 ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } ${
                !isCurrentMonth ? 'opacity-50' : ''
              } ${
                isSelected ? 'ring-2 ring-blue-500' : ''
              } cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50`}
            >
              <div className={`text-right mb-2 ${
                isToday ? 'font-bold text-blue-600' : ''
              }`}>
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                {dayEvents.map(event => (
                  <div
                    key={event.id}
                    className={`px-2 py-1 rounded text-xs text-white ${getEventColor(event.type)}`}
                    title={`${event.title}${event.client ? ` - ${event.client}` : ''}`}
                  >
                    <div className="font-medium truncate">{event.title}</div>
                    {event.client && (
                      <div className="text-[10px] opacity-90 truncate">{event.client}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {selectedDate && getDayEvents(selectedDate).length > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-lg p-6 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
              </h2>
              <button
                onClick={() => setSelectedDate(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              {getDayEvents(selectedDate).map(event => (
                <div 
                  key={event.id}
                  className={`p-4 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-3 h-3 rounded-full mt-1.5 ${getEventColor(event.type)}`} />
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">{event.title}</h3>
                      {event.client && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Cliente: {event.client}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Tipo: {event.type === 'task' ? 'Tarefa' : event.type === 'deadline' ? 'Prazo' : 'Reunião'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Horário: {format(new Date(event.date), 'HH:mm')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setSelectedDate(null)}
                className={`px-4 py-2 rounded-lg ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-lg p-6 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h2 className="text-xl font-bold mb-4">Novo Evento</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Título
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={e => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Data
                </label>
                <input
                  type="date"
                  value={format(newEvent.date, 'yyyy-MM-dd')}
                  onChange={e => setNewEvent(prev => ({ ...prev, date: new Date(e.target.value) }))}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Tipo
                </label>
                <select
                  value={newEvent.type}
                  onChange={e => setNewEvent(prev => ({ ...prev, type: e.target.value as CalendarEvent['type'] }))}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  <option value="deadline">Prazo</option>
                  <option value="meeting">Reunião</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Cliente (opcional)
                </label>
                <input
                  type="text"
                  value={newEvent.client || ''}
                  onChange={e => setNewEvent(prev => ({ ...prev, client: e.target.value }))}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Descrição (opcional)
                </label>
                <textarea
                  value={newEvent.description || ''}
                  onChange={e => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300'
                  }`}
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={`px-4 py-2 rounded-lg ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
