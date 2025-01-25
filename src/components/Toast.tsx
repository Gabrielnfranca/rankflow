import React from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, AlertCircle, XCircle, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  const { theme } = useTheme();

  React.useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-blue-400" />;
    }
  };

  const getStyles = () => {
    const baseStyles = theme === 'dark'
      ? 'bg-gray-800 text-white border-gray-700'
      : 'bg-white text-gray-900 border-gray-100';

    const colorStyles = {
      success: theme === 'dark' ? 'border-l-green-500' : 'border-l-green-500',
      error: theme === 'dark' ? 'border-l-red-500' : 'border-l-red-500',
      info: theme === 'dark' ? 'border-l-blue-500' : 'border-l-blue-500'
    };

    return `${baseStyles} ${colorStyles[type]}`;
  };

  return createPortal(
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div
        className={`flex items-center min-w-[320px] max-w-md p-4 rounded-lg shadow-lg border-l-4 ${getStyles()}`}
        role="alert"
      >
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="ml-3 mr-8 flex-1">
          <p className={`text-sm font-medium ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
          }`}>
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          className={`flex-shrink-0 ml-auto -mr-1 rounded-full p-1 transition-colors ${
            theme === 'dark'
              ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>,
    document.body
  );
}

export function ToastContainer({ toasts, removeToast }: {
  toasts: Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>;
  removeToast: (id: string) => void;
}) {
  return createPortal(
    <div className="fixed top-4 right-4 z-50 space-y-4">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>,
    document.body
  );
}
