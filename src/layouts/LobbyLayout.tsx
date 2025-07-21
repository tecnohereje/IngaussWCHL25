import React from 'react';

interface LobbyLayoutProps {
  children: React.ReactNode;
}

const LobbyLayout: React.FC<LobbyLayoutProps> = ({ children }) => {
  return (
    <div className="lobby-layout">
      <header className="lobby-page-header">
        {/* Espacio para futuro contenido superior */}
      </header>
      <main className="lobby-page-main">
        {children}
      </main>
      <footer className="lobby-page-footer">
        {/* Espacio para futuro contenido inferior */}
      </footer>
    </div>
  );
};

export default LobbyLayout;