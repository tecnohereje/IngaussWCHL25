import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Theme, Box } from '@radix-ui/themes';
import { Toaster } from 'react-hot-toast'; // <-- 1. Import Toaster
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import Loader from './components/Loader';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import LoginButton from './components/LoginButton';
import SettingsPage from './pages/SettingsPage';
import LoginLayout from './layouts/LoginLayout';
import LobbyLayout from './layouts/LobbyLayout';

const App: React.FC = () => {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const { theme } = useTheme();
  
  const accentColor = import.meta.env.VITE_APP_THEME_ACCENT || 'indigo';
  const grayColor = import.meta.env.VITE_APP_THEME_GRAY || 'slate';

  if (isAuthLoading) {
    return <Loader />;
  }

  return (
    <Theme appearance={theme as 'light' | 'dark'} accentColor={accentColor} grayColor={grayColor} panelBackground="translucent" radius="medium">
      <Toaster 
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            borderRadius: 'var(--radius-3)',
            background: 'var(--gray-3)',
            color: 'var(--gray-12)',
            border: '1px solid var(--gray-a5)',
          },
        }}
      />
      <Box className="app-wrapper">
        {isAuthenticated && <Header />}
        
        <main className="content-area">
          <Routes>
            {isAuthenticated ? (
              <>
                <Route path="/" element={<LobbyLayout><Dashboard /></LobbyLayout>} />
                <Route path="/settings" element={<SettingsPage />} />
              </>
            ) : (
              <Route path="*" element={
                <LoginLayout>
                  <LoginButton />
                </LoginLayout>
              } />
            )}
          </Routes>
        </main>
      </Box>
    </Theme>
  );
};

export default App;