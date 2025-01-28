import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { FeedProvider } from './contexts/FeedContext';
import { TaskProvider } from './contexts/TaskContext';
import { KeywordProvider } from './contexts/KeywordContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <FeedProvider>
          <TaskProvider>
            <KeywordProvider>
              <App />
            </KeywordProvider>
          </TaskProvider>
        </FeedProvider>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
);