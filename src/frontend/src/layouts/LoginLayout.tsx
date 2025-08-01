import React from 'react';

// We define the types for the component's props.
// In this case, it accepts 'children' which can be any React node.
interface LoginLayoutProps {
  children: React.ReactNode;
}

const LoginLayout: React.FC<LoginLayoutProps> = ({ children }) => {
  return (
    <div className="login-layout">
      <header className="login-page-header">
        {/* Space for future sponsor logos */}
      </header>
      <main className="login-page-main">
        {children}
      </main>
      <footer className="login-page-footer">
        {/* Space for future partner logos */}
      </footer>
    </div>
  );
};

export default LoginLayout;