import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { KeyRound, Loader2 } from 'lucide-react';

export function ResetPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { resetPassword, loading } = useAuth();
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      await resetPassword(email);
      setMessage('Instruções de recuperação enviadas para seu email');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className={`max-w-md w-full space-y-8 p-8 rounded-xl shadow-lg ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div>
          <h1 className="text-3xl font-bold text-center mb-2">RankFlow</h1>
          <h2 className="text-xl font-semibold text-center">Recuperar senha</h2>
          {error && (
            <div className="mt-4 p-3 rounded bg-red-100 border border-red-400 text-red-700">
              {error}
            </div>
          )}
          {message && (
            <div className="mt-4 p-3 rounded bg-green-100 border border-green-400 text-green-700">
              {message}
            </div>
          )}
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300'
              }`}
              placeholder="seu@email.com"
            />
          </div>

          <div className="text-sm">
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Voltar para o login
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center px-4 py-2 rounded-lg text-white font-medium ${
              loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <KeyRound className="w-5 h-5 mr-2" />
                Recuperar senha
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
