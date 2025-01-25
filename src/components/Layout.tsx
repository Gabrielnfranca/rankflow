import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  FileText, 
  Settings as SettingsIcon,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  MessageSquare,
  Calendar,
  Clock,
  Briefcase,
  Phone,
  Mail,
  HardDrive,
  BarChart2,
  Search,
  Bell,
  HelpCircle,
  Download,
  Link as LinkIcon,
  Link2
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Feed' },
    { path: '/clients', icon: Users, label: 'Clientes' },
    { path: '/tasks', icon: CheckSquare, label: 'Tarefas' },
    { path: '/reports', icon: BarChart2, label: 'Analytics' },
    { path: '/backlinks', icon: LinkIcon, label: 'Backlinks' },
    { path: '/my-backlinks', icon: Link2, label: 'Meus Backlinks' },
    { path: '/settings', icon: SettingsIcon, label: 'Configurações' }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === 'dark' ? 'bg-[#1B1B1B]' : 'bg-[#f5f5f5]'
    }`}>
      {/* Top Bar */}
      <div className={`fixed top-0 left-0 right-0 h-14 z-50 ${
        theme === 'dark' ? 'bg-[#2B2B2B]' : 'bg-[#3B52C2]'
      } px-4 flex items-center justify-between`}>
        <div className="flex items-center">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden text-white p-2"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="text-white font-bold text-xl ml-2">Rankflow</div>
        </div>

        <div className="flex-1 max-w-2xl mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full px-4 py-1.5 pl-10 rounded-full text-sm ${
                theme === 'dark' 
                  ? 'bg-[#3D3D3D] text-white placeholder-gray-400 border-gray-600' 
                  : 'bg-white/90 text-gray-800 placeholder-gray-500'
              } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="text-white hover:text-gray-200">
            <Bell size={20} />
          </button>
          <button className="text-white hover:text-gray-200">
            <HelpCircle size={20} />
          </button>
          <button 
            onClick={toggleTheme}
            className="text-white hover:text-gray-200"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
            JS
          </div>
        </div>
      </div>

      <div className="pt-14 flex min-h-screen">
        {/* Sidebar */}
        <aside 
          className={`fixed lg:sticky lg:top-14 z-40 h-[calc(100vh-3.5rem)] group overflow-y-auto ${
            theme === 'dark' ? 'bg-[#2B2B2B]' : 'bg-[#fff]'
          }`}
          onMouseEnter={() => setIsSidebarOpen(true)}
          onMouseLeave={() => setIsSidebarOpen(false)}
        >
          <div className={`flex flex-col h-full transition-all duration-300 ${
            isSidebarOpen ? 'w-64' : 'w-16'
          }`}>
            <nav className="flex-1 py-4">
              <div className="space-y-1 px-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center h-10 px-2 rounded-lg transition-colors ${
                        isActive 
                          ? theme === 'dark'
                            ? 'bg-blue-600 text-white'
                            : 'bg-[#3B52C2] text-white'
                          : theme === 'dark'
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5 min-w-[20px]" />
                      <span className={`ml-2 whitespace-nowrap transition-opacity duration-300 ${
                        isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:group-hover:opacity-100'
                      }`}>
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
                <button
                  onClick={handleLogout}
                  className={`flex items-center h-10 px-2 rounded-lg transition-colors w-full ${
                    theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <LogOut className="w-5 h-5 min-w-[20px]" />
                  <span className={`ml-2 whitespace-nowrap transition-opacity duration-300 ${
                    isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:group-hover:opacity-100'
                  }`}>
                    Sair
                  </span>
                </button>
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}