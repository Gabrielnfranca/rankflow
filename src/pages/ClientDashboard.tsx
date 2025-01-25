import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { 
  Globe, 
  TrendingUp, 
  Link as LinkIcon, 
  FileText, 
  Wallet,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  ArrowUpRight,
  Calendar,
  MessageSquare,
  BarChart2,
  Download,
  ExternalLink,
  Eye,
  Search
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useFeed } from '../contexts/FeedContext';
import { useClients } from '../contexts/ClientContext';
import { useKeywords } from '../contexts/KeywordContext';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { KeywordModal } from '../components/KeywordModal';

const rankingData = [];
const trafficData = [];
const conversionData = [];

export function ClientDashboard() {
  const { id } = useParams();
  const { theme } = useTheme();
  const { getFeedByClient } = useFeed();
  const { clients } = useClients();
  const { getClientKeywords } = useKeywords();
  const clientId = parseInt(id || '1');
  const client = clients.find(c => c.id === clientId);
  const clientFeed = getFeedByClient(clientId);
  const [isKeywordModalOpen, setIsKeywordModalOpen] = useState(false);
  const clientKeywords = getClientKeywords(clientId);
  const completedTasks = clientFeed.filter(item => item.type === 'task_completed').length;
  const pendingTasks = clientFeed.filter(item => item.type === 'task_pending').length;
  const totalTasks = completedTasks + pendingTasks;
  
  // Calcular progresso baseado nas tarefas
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Calcular média de posição das palavras-chave
  const averagePosition = clientKeywords.length > 0
    ? Math.round(clientKeywords.reduce((acc, kw) => acc + kw.position, 0) / clientKeywords.length)
    : 0;
  
  // Calcular melhoria nas posições
  const keywordsImproved = clientKeywords.filter(kw => kw.previousPosition > kw.position).length;
  const improvementRate = clientKeywords.length > 0
    ? Math.round((keywordsImproved / clientKeywords.length) * 100)
    : 0;

  if (!client) {
    return <div>Cliente não encontrado</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
              theme === 'dark' ? 'bg-blue-600' : 'bg-[#3B52C2]'
            }`}>
              <span className="text-2xl font-bold text-white">{client.initials}</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{client.name}</h1>
              <div className="flex items-center space-x-4 text-sm">
                {client.website && (
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <Globe className="w-4 h-4 mr-2" />
                    <a
                      href={`https://${client.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-500"
                    >
                      {client.website}
                    </a>
                  </div>
                )}
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <Clock className="w-4 h-4 mr-2" />
                  Cliente desde {format(new Date('2023-01-15'), 'MMM yyyy', { locale: ptBR })}
                </div>
              </div>
              <p>
                <span className="font-medium">Email:</span>{' '}
                {client.email || 'Não informado'}
              </p>
            </div>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setIsKeywordModalOpen(true)}
            className={`px-4 py-2 rounded-lg flex items-center ${
              theme === 'dark'
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Search className="w-4 h-4 mr-2" />
            Palavras-chave
          </button>
          <button className={`px-4 py-2 rounded-lg flex items-center ${
            theme === 'dark'
              ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </button>
          <button className={`px-4 py-2 rounded-lg flex items-center ${
            theme === 'dark'
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-[#3B52C2] text-white hover:bg-[#2B419E]'
          }`}>
            <Download className="w-4 h-4 mr-2" />
            Relatório
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Tarefas Concluídas"
          value={`${completedTasks}/${totalTasks}`}
          trend={`${progress}%`}
          trendUp={progress > 50}
          icon={CheckCircle2}
          description="do total de tarefas"
        />
        <StatCard
          title="Palavras-chave"
          value={clientKeywords.length.toString()}
          trend={`${improvementRate}%`}
          trendUp={improvementRate > 0}
          icon={BarChart2}
          description="com melhoria de posição"
        />
        <StatCard
          title="Posição Média"
          value={`#${averagePosition}`}
          trend={averagePosition <= 30 ? "Bom" : "Precisa melhorar"}
          trendUp={averagePosition <= 30}
          icon={TrendingUp}
          description="nas palavras-chave"
        />
        <StatCard
          title="Tarefas Pendentes"
          value={pendingTasks.toString()}
          trend={pendingTasks === 0 ? "Em dia" : "Pendente"}
          trendUp={pendingTasks === 0}
          icon={Clock}
          description="aguardando conclusão"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`rounded-lg shadow-sm ${
          theme === 'dark' ? 'bg-[#2B2B2B]' : 'bg-white'
        }`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Tráfego por Canal</h2>
              <select className={`text-sm px-2 py-1 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-[#3D3D3D] border-gray-600 text-gray-300'
                  : 'bg-white border-gray-300 text-gray-700'
              }`}>
                <option>Últimos 6 meses</option>
                <option>Último mês</option>
                <option>Último ano</option>
              </select>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData}>
                  <defs>
                    <linearGradient id="organic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="direct" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="referral" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                  <XAxis dataKey="month" stroke={theme === 'dark' ? '#9ca3af' : '#4b5563'} />
                  <YAxis stroke={theme === 'dark' ? '#9ca3af' : '#4b5563'} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                      borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                    }}
                  />
                  <Area type="monotone" dataKey="organic" stroke="#3B82F6" fill="url(#organic)" />
                  <Area type="monotone" dataKey="direct" stroke="#10B981" fill="url(#direct)" />
                  <Area type="monotone" dataKey="referral" stroke="#F59E0B" fill="url(#referral)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className={`rounded-lg shadow-sm ${
          theme === 'dark' ? 'bg-[#2B2B2B]' : 'bg-white'
        }`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Taxa de Conversão</h2>
              <select className={`text-sm px-2 py-1 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-[#3D3D3D] border-gray-600 text-gray-300'
                  : 'bg-white border-gray-300 text-gray-700'
              }`}>
                <option>Últimos 6 meses</option>
                <option>Último mês</option>
                <option>Último ano</option>
              </select>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={conversionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                  <XAxis dataKey="month" stroke={theme === 'dark' ? '#9ca3af' : '#4b5563'} />
                  <YAxis stroke={theme === 'dark' ? '#9ca3af' : '#4b5563'} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                      borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                    }}
                    formatter={(value: any) => [`${value}%`, 'Taxa de Conversão']}
                  />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#3B82F6' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Rankings and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`rounded-lg shadow-sm ${
          theme === 'dark' ? 'bg-[#2B2B2B]' : 'bg-white'
        }`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Rankings</h2>
              <select 
                className={`text-sm px-2 py-1 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-[#3D3D3D] border-gray-600 text-gray-300'
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
                defaultValue="week"
              >
                <option value="week">Última semana</option>
                <option value="month">Último mês</option>
              </select>
            </div>
            <div className="space-y-4">
              {clientKeywords.map((keyword, index) => {
                const positionChange = keyword.previousPosition - keyword.position;
                const isImprovement = positionChange > 0;
                const changeText = isImprovement 
                  ? `↑ ${positionChange}` 
                  : positionChange < 0 
                    ? `↓ ${Math.abs(positionChange)}` 
                    : '=';
                const changeClass = isImprovement 
                  ? 'text-green-500' 
                  : positionChange < 0 
                    ? 'text-red-500' 
                    : 'text-gray-500';
                
                return (
                  <div key={keyword.id} className={`p-4 rounded-lg ${
                    theme === 'dark' ? 'bg-[#333333]' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <span className="font-medium">{keyword.term}</span>
                        <div className="text-sm text-gray-500 mt-1">
                          Atualizado em {format(new Date(keyword.lastUpdated), "dd/MM/yyyy", { locale: ptBR })}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold">#{keyword.position}</div>
                          <div className={`text-sm ${changeClass}`}>
                            {changeText} posições
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm ${
                          keyword.position <= 10 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : keyword.position <= 30
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {keyword.position <= 10 
                            ? 'Excelente'
                            : keyword.position <= 30
                              ? 'Bom'
                              : 'Precisa melhorar'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {keyword.volume.toLocaleString()} pesquisas/mês
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className={`rounded-lg shadow-sm ${
          theme === 'dark' ? 'bg-[#2B2B2B]' : 'bg-white'
        }`}>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-6">Atividades Recentes</h2>
            <div className="space-y-4">
              {clientFeed.map((item) => (
                <div key={item.id} className={`p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-[#333333]' : 'bg-gray-50'
                }`}>
                  <div className="flex items-start">
                    <div className={`p-2 rounded-lg mr-4 ${
                      item.type === 'task_completed'
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                        : item.type === 'task_pending'
                        ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {item.type === 'task_completed' && <CheckCircle2 className="w-5 h-5" />}
                      {item.type === 'task_pending' && <Clock className="w-5 h-5" />}
                      {item.type === 'task_moved' && <AlertCircle className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-medium">{item.taskTitle}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {format(new Date(item.timestamp), "dd MMM 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <h2 className="text-lg font-semibold mb-4">Informações do Cliente</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Email:</span>{' '}
              {client.email || 'Não informado'}
            </p>
            <p>
              <span className="font-medium">Status:</span>{' '}
              <span className={`px-2 py-1 rounded-full text-xs ${
                theme === 'dark'
                  ? 'bg-green-900/30 text-green-400'
                  : 'bg-green-100 text-green-800'
              }`}>
                {client.status || 'Ativo'}
              </span>
            </p>
            <div>
              <span className="font-medium">Progresso:</span>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <KeywordModal
        isOpen={isKeywordModalOpen}
        onClose={() => setIsKeywordModalOpen(false)}
        clientId={clientId}
      />
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  trend, 
  trendUp,
  icon: Icon,
  description
}: { 
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: React.ElementType;
  description: string;
}) {
  const { theme } = useTheme();
  
  return (
    <div className={`rounded-lg shadow-sm ${
      theme === 'dark' ? 'bg-[#2B2B2B]' : 'bg-white'
    }`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${
            theme === 'dark' ? 'bg-[#333333]' : 'bg-gray-100'
          }`}>
            <Icon className="w-6 h-6 text-blue-500" />
          </div>
        </div>
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
          {title}
        </p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
        <div className="flex items-center mt-2">
          <span className={`text-sm font-medium ${
            trendUp ? 'text-green-500' : 'text-red-500'
          }`}>
            {trend}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
            {description}
          </span>
        </div>
      </div>
    </div>
  );
}