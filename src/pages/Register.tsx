import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Loader2 } from 'lucide-react';

export function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { register, error: authError } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [localError, setLocalError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setIsLoading(true);

    if (!email || !password || !name) {
      setLocalError('Por favor, preencha todos os campos');
      setIsLoading(false);
      return;
    }

    try {
      const { user, profile } = await register(email, password, name);
      console.log('Registro bem-sucedido!', { user, profile });
      
      // Aguarda um pequeno delay para garantir que tudo foi processado
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (error: any) {
      console.error('Erro durante o registro:', error);
      if (error.message.includes('Email rate limit exceeded')) {
        setLocalError('Muitas tentativas. Tente novamente mais tarde.');
      } else if (error.message.includes('already registered')) {
        setLocalError('Este email já está registrado.');
      } else {
        setLocalError(error.message || 'Erro ao criar conta');
      }
      setIsLoading(false);
    }
  };

  const errorMessage = localError || authError;

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`max-w-md w-full space-y-8 p-8 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div>
          <h2 className={`mt-6 text-center text-3xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Criar nova conta
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                Nome
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  theme === 'dark' ? 'border-gray-700 bg-gray-700 text-white' : 'border-gray-300 text-gray-900'
                } rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                placeholder="Seu nome"
              />
            </div>

            <div>
              <label htmlFor="email" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  theme === 'dark' ? 'border-gray-700 bg-gray-700 text-white' : 'border-gray-300 text-gray-900'
                } rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                Senha
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  theme === 'dark' ? 'border-gray-700 bg-gray-700 text-white' : 'border-gray-300 text-gray-900'
                } rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                placeholder="••••••••"
              />
            </div>
          </div>

          {errorMessage && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{errorMessage}</h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  <span>Criando conta...</span>
                </div>
              ) : (
                'Criar conta'
              )}
            </button>
          </div>

          <div className="flex items-center justify-center">
            <div className="text-sm">
              <Link
                to="/login"
                className={`font-medium ${
                  theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'
                }`}
              >
                Já tem uma conta? Faça login
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
