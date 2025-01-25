import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

interface FeedItem {
  id: number;
  type: 'task_completed' | 'task_pending' | 'task_moved';
  taskTitle: string;
  clientId: number;
  clientName: string;
  timestamp: string;
  status?: string;
}

const MOCK_FEED: FeedItem[] = [
  {
    id: 1,
    type: 'task_completed',
    taskTitle: 'Análise Técnica',
    clientId: 1,
    clientName: 'Cliente A',
    timestamp: new Date().toISOString(),
    status: 'concluida'
  },
  {
    id: 2,
    type: 'task_pending',
    taskTitle: 'Pesquisa de Palavras-chave',
    clientId: 2,
    clientName: 'Cliente B',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: 'pendente'
  }
];

export function Feed() {
  const { theme } = useTheme();
  const [feedItems, setFeedItems] = React.useState<FeedItem[]>(MOCK_FEED);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Feed de Atividades</h1>

      <div className={`rounded-lg shadow-sm ${
        theme === 'dark' ? 'bg-[#2B2B2B]' : 'bg-white'
      }`}>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {feedItems.map((item) => (
            <FeedItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FeedItemCard({ item }: { item: FeedItem }) {
  const { theme } = useTheme();

  const getIcon = () => {
    switch (item.type) {
      case 'task_completed':
        return <CheckCircle2 className="w-6 h-6 text-green-500" />;
      case 'task_pending':
        return <Clock className="w-6 h-6 text-yellow-500" />;
      case 'task_moved':
        return <AlertCircle className="w-6 h-6 text-blue-500" />;
      default:
        return null;
    }
  };

  const getMessage = () => {
    switch (item.type) {
      case 'task_completed':
        return 'Tarefa concluída';
      case 'task_pending':
        return 'Nova tarefa pendente';
      case 'task_moved':
        return 'Tarefa movida para';
      default:
        return '';
    }
  };

  return (
    <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200">
      <div className="flex items-start space-x-4">
        <div className={`p-2 rounded-lg ${
          item.type === 'task_completed'
            ? 'bg-green-100 dark:bg-green-900/30'
            : item.type === 'task_pending'
            ? 'bg-yellow-100 dark:bg-yellow-900/30'
            : 'bg-blue-100 dark:bg-blue-900/30'
        }`}>
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              {getMessage()}{' '}
              <span className={`${
                item.status === 'concluida'
                  ? 'text-green-600 dark:text-green-400'
                  : item.status === 'pendente'
                  ? 'text-yellow-600 dark:text-yellow-400'
                  : 'text-blue-600 dark:text-blue-400'
              }`}>
                {item.taskTitle}
              </span>
            </p>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {format(new Date(item.timestamp), "dd MMM 'às' HH:mm", { locale: ptBR })}
            </span>
          </div>
          <div className="mt-1">
            <Link
              to={`/client/${item.clientId}`}
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {item.clientName}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}