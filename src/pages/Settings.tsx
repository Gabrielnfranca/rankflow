import React, { useState, useEffect } from 'react';
import { 
  User, Lock, Bell, Palette, Save, Loader2, Camera, Moon, Sun, 
  Shield, Smartphone, Trash2, Mail, Globe, Monitor
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';

type Tab = 'profile' | 'security' | 'notifications' | 'appearance';

export function Settings() {
  const { user, profile, loading: authLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [isLoading, setIsLoading] = useState(false);

  // Profile State
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bio, setBio] = useState('');

  // Password State
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setUsername(profile.username || '');
      setAvatarUrl(profile.avatar_url || '');
      // Mock bio since it's not in the database yet
      setBio('SEO Specialist & Content Strategist');
    }
  }, [profile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          username: username,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      showToast('Perfil atualizado com sucesso!', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Erro ao atualizar perfil.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast('As senhas não coincidem.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;
      
      showToast('Senha atualizada com sucesso!', 'success');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
      showToast('Erro ao atualizar senha.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Meu Perfil', icon: User, description: 'Gerencie suas informações pessoais' },
    { id: 'security', label: 'Segurança', icon: Shield, description: 'Proteja sua conta e dados' },
    { id: 'notifications', label: 'Notificações', icon: Bell, description: 'Escolha como ser notificado' },
    { id: 'appearance', label: 'Aparência', icon: Palette, description: 'Personalize sua experiência' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Configurações</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Gerencie suas preferências e configurações da conta RankFlow.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar de Navegação */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`w-full flex items-center p-4 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-white dark:bg-gray-800 shadow-md border-l-4 border-blue-600'
                      : 'hover:bg-white/50 dark:hover:bg-gray-800/50 hover:shadow-sm'
                  }`}
                >
                  <div className={`p-2 rounded-lg mr-4 transition-colors ${
                    isActive 
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className={`block font-medium ${
                      isActive ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {tab.label}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                      {tab.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Área de Conteúdo */}
        <main className="flex-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 md:p-8">
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Informações do Perfil</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Atualize sua foto e dados pessoais.</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-8">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-16 h-16 text-gray-400" />
                        )}
                      </div>
                      <button className="absolute bottom-2 right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-md cursor-pointer group-hover:scale-110 duration-200">
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{profile?.full_name || 'Usuário'}</h3>
                      <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
                      <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        Plano Pro
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Nome Completo
                        </label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Nome de Usuário
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-2.5 text-gray-500 dark:text-gray-400">@</span>
                          <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bio
                      </label>
                      <textarea
                        rows={3}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                        placeholder="Conte um pouco sobre você..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <div className="flex items-center">
                        <Mail className="w-5 h-5 text-gray-400 mr-2" />
                        <input
                          type="email"
                          value={user?.email || ''}
                          disabled
                          className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">Para alterar seu email, entre em contato com o suporte.</p>
                    </div>

                    <div className="pt-4 flex items-center justify-end">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
                        Salvar Alterações
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-8">
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Segurança da Conta</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Gerencie sua senha e métodos de autenticação.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                        <Lock className="w-5 h-5 mr-2 text-blue-500" />
                        Alterar Senha
                      </h3>
                      <form onSubmit={handleUpdatePassword} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Nova Senha
                          </label>
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            placeholder="Mínimo de 6 caracteres"
                            minLength={6}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Confirmar Nova Senha
                          </label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            placeholder="Repita a nova senha"
                            minLength={6}
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isLoading || !password}
                          className="w-full flex items-center justify-center px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                        >
                          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Atualizar Senha'}
                        </button>
                      </form>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-green-500" />
                        Autenticação em Duas Etapas
                      </h3>
                      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Autenticador App</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Proteja sua conta com 2FA.</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">
                          Recomendamos o uso do Google Authenticator ou Authy.
                        </p>
                      </div>

                      <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center pt-4">
                        <Smartphone className="w-5 h-5 mr-2 text-purple-500" />
                        Sessões Ativas
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                          <div className="flex items-center">
                            <Monitor className="w-5 h-5 text-gray-400 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">Windows PC - Chrome</p>
                              <p className="text-xs text-green-500">Dispositivo Atual</p>
                            </div>
                          </div>
                          <span className="text-xs text-gray-400">São Paulo, BR</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 opacity-75">
                          <div className="flex items-center">
                            <Smartphone className="w-5 h-5 text-gray-400 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">iPhone 13 - Safari</p>
                              <p className="text-xs text-gray-500">Último acesso: 2h atrás</p>
                            </div>
                          </div>
                          <button className="text-xs text-red-500 hover:text-red-600">Sair</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-red-600 mb-4 flex items-center">
                      <Trash2 className="w-5 h-5 mr-2" />
                      Zona de Perigo
                    </h3>
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-red-800 dark:text-red-200">Deletar Conta</p>
                        <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                          Uma vez deletada, sua conta não pode ser recuperada. Por favor, tenha certeza.
                        </p>
                      </div>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                        Deletar Conta
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-8">
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Aparência e Preferências</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Personalize como o RankFlow se parece para você.</p>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Tema</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <button
                        onClick={() => theme === 'dark' && toggleTheme()}
                        className={`relative p-4 rounded-xl border-2 flex flex-col items-center space-y-3 transition-all ${
                          theme === 'light'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="p-3 rounded-full bg-white shadow-sm">
                          <Sun className="w-6 h-6 text-orange-500" />
                        </div>
                        <span className={`font-medium ${theme === 'light' ? 'text-blue-700' : 'text-gray-700 dark:text-gray-300'}`}>
                          Claro
                        </span>
                        {theme === 'light' && (
                          <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </button>

                      <button
                        onClick={() => theme === 'light' && toggleTheme()}
                        className={`relative p-4 rounded-xl border-2 flex flex-col items-center space-y-3 transition-all ${
                          theme === 'dark'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="p-3 rounded-full bg-gray-800 shadow-sm">
                          <Moon className="w-6 h-6 text-blue-400" />
                        </div>
                        <span className={`font-medium ${theme === 'dark' ? 'text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                          Escuro
                        </span>
                        {theme === 'dark' && (
                          <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </button>

                      <button
                        disabled
                        className="relative p-4 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center space-y-3 opacity-60 cursor-not-allowed"
                      >
                        <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-sm">
                          <Monitor className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-medium text-gray-500">Sistema</span>
                        <span className="text-xs text-gray-400">(Em breve)</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                      <Globe className="w-5 h-5 mr-2 text-gray-500" />
                      Idioma e Região
                    </h3>
                    <div className="max-w-md">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Idioma da Interface
                      </label>
                      <select className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="pt-BR">Português (Brasil)</option>
                        <option value="en-US">English (US)</option>
                        <option value="es">Español</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-8">
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Preferências de Notificação</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Controle quando e como você recebe alertas.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-start">
                      <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">Dica Pro</h4>
                        <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                          Ative as notificações push para receber alertas em tempo real sobre prazos críticos.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {[
                        { 
                          title: 'Relatórios Semanais', 
                          desc: 'Receba um resumo semanal do desempenho dos seus clientes por email.',
                          default: true
                        },
                        { 
                          title: 'Novas Tarefas Atribuídas', 
                          desc: 'Seja notificado imediatamente quando uma nova tarefa for atribuída a você.',
                          default: true
                        },
                        { 
                          title: 'Alertas de Prazo', 
                          desc: 'Receba lembretes 24h antes do vencimento de tarefas importantes.',
                          default: true
                        },
                        { 
                          title: 'Atualizações de Backlinks', 
                          desc: 'Notificações quando o status de um backlink mudar (ex: Publicado).',
                          default: false
                        },
                        { 
                          title: 'Novidades do RankFlow', 
                          desc: 'Receba notícias sobre novas funcionalidades e atualizações do sistema.',
                          default: false
                        },
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <div className="pr-4">
                            <h3 className="font-medium text-gray-900 dark:text-white">{item.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                            <input type="checkbox" className="sr-only peer" defaultChecked={item.default} />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
