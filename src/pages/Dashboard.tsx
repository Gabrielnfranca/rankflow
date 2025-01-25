import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { 
  Users, 
  Link as LinkIcon, 
  FileText, 
  TrendingUp, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Calendar,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useTasks } from '../contexts/TaskContext';
import { useKeywords } from '../contexts/KeywordContext';
import { useClients } from '../contexts/ClientContext';

const keywordData = [
  { name: 'Jan', top3: 2, top10: 8, top30: 15 },
  { name: 'Fev', top3: 3, top10: 10, top30: 18 },
  { name: 'Mar', top3: 4, top10: 12, top30: 20 },
  { name: 'Abr', top3: 5, top10: 15, top30: 25 },
  { name: 'Mai', top3: 6, top10: 18, top30: 28 },
  { name: 'Jun', top3: 8, top10: 20, top30: 32 }
];

export function Dashboard() {
  const { theme } = useTheme();
  const { tasks } = useTasks();
  const { keywords } = useKeywords();
  const { clients } = useClients();
  const [selectedClient, setSelectedClient] = React.useState<string>('all');

  // Agrupar tarefas por cliente
  const clientProgress = React.useMemo(() => {
    const progress = {};
    tasks.forEach(task => {
      if (!progress[task.client]) {
        progress[task.client] = {
          total: 0,
          completed: 0,
          urgent: 0,
          warning: 0,
          tasks: []
        };
      }
      
      progress[task.client].total++;
      if (task.status === 'concluido') {
        progress[task.client].completed++;
      }

      // Verificar prazo
      const deadline = new Date(task.deadline + 'T00:00:00');
      const now = new Date();
      const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays < 0 && task.status !== 'concluido') {
        progress[task.client].urgent++;
      } else if (diffDays <= 3 && task.status !== 'concluido') {
        progress[task.client].warning++;
      }

      progress[task.client].tasks.push(task);
    });
    return progress;
  }, [tasks]);

  // Agrupar keywords por mês e posição
  const keywordData = React.useMemo(() => {
    if (!keywords) return [];

    const filteredKeywords = selectedClient === 'all' 
      ? keywords 
      : keywords.filter(k => k.clientId === selectedClient);

    const monthlyData = filteredKeywords.reduce((acc, keyword) => {
      const date = new Date(keyword.updatedAt);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      
      if (!acc[monthYear]) {
        acc[monthYear] = {
          name: monthYear,
          top3: 0,
          top10: 0,
          top30: 0
        };
      }

      const position = Number(keyword.currentPosition);
      if (position <= 3) acc[monthYear].top3++;
      if (position <= 10) acc[monthYear].top10++;
      if (position <= 30) acc[monthYear].top30++;

      return acc;
    }, {});

    return Object.values(monthlyData).sort((a: any, b: any) => {
      const [monthA, yearA] = a.name.split('/');
      const [monthB, yearB] = b.name.split('/');
      return new Date(yearA, monthA - 1).getTime() - new Date(yearB, monthB - 1).getTime();
    });
  }, [keywords, selectedClient]);

  return (
    <div className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Dashboard
        </h1>
        <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Visão geral do progresso dos clientes e tarefas
        </p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className={`p-6 rounded-xl border ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        } shadow-sm hover:shadow-md transition-shadow`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Total de Clientes
              </p>
              <h3 className={`text-2xl font-bold mt-1 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {Object.keys(clientProgress).length}
              </h3>
            </div>
            <div className={`p-3 rounded-full ${
              theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50'
            }`}>
              <Users className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        } shadow-sm hover:shadow-md transition-shadow`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Tarefas Atrasadas
              </p>
              <h3 className={`text-2xl font-bold mt-1 text-red-500`}>
                {Object.values(clientProgress).reduce((acc: number, curr: any) => acc + curr.urgent, 0)}
              </h3>
            </div>
            <div className={`p-3 rounded-full ${
              theme === 'dark' ? 'bg-red-500/10' : 'bg-red-50'
            }`}>
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        } shadow-sm hover:shadow-md transition-shadow`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Próximas do Prazo
              </p>
              <h3 className={`text-2xl font-bold mt-1 text-yellow-500`}>
                {Object.values(clientProgress).reduce((acc: number, curr: any) => acc + curr.warning, 0)}
              </h3>
            </div>
            <div className={`p-3 rounded-full ${
              theme === 'dark' ? 'bg-yellow-500/10' : 'bg-yellow-50'
            }`}>
              <Clock className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        } shadow-sm hover:shadow-md transition-shadow`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Taxa de Conclusão
              </p>
              <h3 className={`text-2xl font-bold mt-1 text-green-500`}>
                {Math.round(
                  (Object.values(clientProgress).reduce((acc: number, curr: any) => acc + curr.completed, 0) /
                  Object.values(clientProgress).reduce((acc: number, curr: any) => acc + curr.total, 0)) * 100
                )}%
              </h3>
            </div>
            <div className={`p-3 rounded-full ${
              theme === 'dark' ? 'bg-green-500/10' : 'bg-green-50'
            }`}>
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Progresso por Cliente */}
      <div className={`rounded-xl border ${
        theme === 'dark' 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      } shadow-sm p-6 mb-8`}>
        <h2 className={`text-xl font-bold mb-6 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Progresso por Cliente
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(clientProgress).map(([client, data]: [string, any]) => (
            <div
              key={client}
              className={`p-6 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-900/50 border-gray-700'
                  : 'bg-gray-50 border-gray-200'
              } hover:shadow-md transition-shadow`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className={`text-lg font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {client}
                  </h3>
                  <p className={`text-sm mt-1 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {data.total} tarefas no total
                  </p>
                </div>
                {data.urgent > 0 ? (
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/10 text-red-500">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Urgente</span>
                  </div>
                ) : data.warning > 0 ? (
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">Atenção</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/10 text-green-500">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Em dia</span>
                  </div>
                )}
              </div>

              {/* Barra de Progresso */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Progresso
                  </span>
                  <span className={`text-sm font-medium ${
                    data.completed === data.total
                      ? 'text-green-500'
                      : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {Math.round((data.completed / data.total) * 100)}%
                  </span>
                </div>
                <div className={`h-2 rounded-full ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      data.completed === data.total
                        ? 'bg-green-500'
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${(data.completed / data.total) * 100}%` }}
                  />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-3">
                {data.urgent > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-red-500">
                        Atrasadas
                      </span>
                    </div>
                    <span className="text-sm font-medium text-red-500">
                      {data.urgent}
                    </span>
                  </div>
                )}

                {data.warning > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-yellow-500">
                        Próximas do Prazo
                      </span>
                    </div>
                    <span className="text-sm font-medium text-yellow-500">
                      {data.warning}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-4 h-4 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Concluídas
                    </span>
                  </div>
                  <span className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {data.completed}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gráfico de Desempenho de Keywords */}
      <div className={`rounded-xl border ${
        theme === 'dark' 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      } shadow-sm p-6`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Desempenho de Keywords
          </h2>
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className={`px-3 py-2 rounded-lg border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="all">Todos os Clientes</option>
            {clients?.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={keywordData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                stroke={theme === 'dark' ? '#9CA3AF' : '#4B5563'}
              />
              <YAxis 
                stroke={theme === 'dark' ? '#9CA3AF' : '#4B5563'}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="top3" 
                stroke="#10B981" 
                name="Top 3"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="top10" 
                stroke="#3B82F6" 
                name="Top 10"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="top30" 
                stroke="#6366F1" 
                name="Top 30"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}