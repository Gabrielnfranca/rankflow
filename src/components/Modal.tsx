import React from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../contexts/ThemeContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

export function Modal({ isOpen, onClose, children, title }: ModalProps) {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div 
          className="fixed inset-0 bg-black/50 transition-opacity" 
          onClick={onClose}
        />
        
        <div className={`relative w-full max-w-4xl rounded-lg shadow-lg ${
          theme === 'dark' ? 'bg-[#2B2B2B]' : 'bg-white'
        }`}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
