import React from 'react';

// Definimos los tipos para las props del componente.
// En este caso, acepta 'children' que pueden ser cualquier nodo de React.
interface LoginLayoutProps {
  children: React.ReactNode;
}

const LoginLayout: React.FC<LoginLayoutProps> = ({ children }) => {
  return (
    <div className="login-layout">
      <header className="login-page-header">
        {/* Espacio para futuros logos de sponsors */}
      </header>
      <main className="login-page-main">
        {children}
      </main>
      <footer className="login-page-footer">
        {/* Espacio para futuros logos de aliados */}
      </footer>
    </div>
  );
};

export default LoginLayout;