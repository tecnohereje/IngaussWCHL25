import React from 'react';

interface LobbyLayoutProps {
  children: React.ReactNode;
}

const LobbyLayout: React.FC<LobbyLayoutProps> = ({ children }) => {
  return (
    <div className="lobby-layout">
      <header className="lobby-page-header">
        {/* Space for future top content */}
      </header>
      <main className="lobby-page-main">
        {children}
      </main>
      <footer className="lobby-page-footer">
        {/* Space for future bottom content */}
      </footer>
    </div>
  );
};

export default LobbyLayout;