import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Clients } from './pages/Clients';
import { ClientDashboard } from './pages/ClientDashboard';
import { Tasks } from './pages/Tasks';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Backlinks } from './pages/Backlinks';
import { MyBacklinks } from './pages/MyBacklinks';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ResetPassword } from './pages/ResetPassword';
import { ThemeProvider } from './contexts/ThemeContext';
import { FeedProvider } from './contexts/FeedContext';
import { TaskProvider } from './contexts/TaskContext';
import { ToastProvider } from './contexts/ToastContext';
import { BacklinkProvider } from './contexts/BacklinkContext';
import { ClientProvider } from './contexts/ClientContext';
import { MyBacklinksProvider } from './contexts/MyBacklinksContext';
import { KeywordProvider } from './contexts/KeywordContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true });
    }
  }, [loading, user, navigate]);

  // Mostra loading apenas se estiver carregando E não tivermos informação do usuário
  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Se não está carregando e não tem usuário, não renderiza nada (useEffect cuidará do redirecionamento)
  if (!user) {
    return null;
  }

  // Se tem usuário, renderiza o conteúdo
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <Routes>
              {/* Rotas Públicas */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Rotas Privadas */}
              <Route
                path="/*"
                element={
                  <PrivateRoute>
                    <ClientProvider>
                      <TaskProvider>
                        <BacklinkProvider>
                          <MyBacklinksProvider>
                            <FeedProvider>
                              <KeywordProvider>
                                <Layout>
                                  <Routes>
                                    <Route path="/" element={<Dashboard />} />
                                    <Route path="/clients" element={<Clients />} />
                                    <Route path="/client/:id" element={<ClientDashboard />} />
                                    <Route path="/tasks" element={<Tasks />} />
                                    <Route path="/reports" element={<Reports />} />
                                    <Route path="/settings" element={<Settings />} />
                                    <Route path="/backlinks" element={<Backlinks />} />
                                    <Route path="/my-backlinks" element={<MyBacklinks />} />
                                    <Route path="*" element={<Navigate to="/" replace />} />
                                  </Routes>
                                </Layout>
                              </KeywordProvider>
                            </FeedProvider>
                          </MyBacklinksProvider>
                        </BacklinkProvider>
                      </TaskProvider>
                    </ClientProvider>
                  </PrivateRoute>
                }
              />
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
