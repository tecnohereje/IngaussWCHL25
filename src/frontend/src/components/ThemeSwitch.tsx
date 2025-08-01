import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { IconButton } from '@radix-ui/themes';

const ThemeSwitch: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <IconButton variant="soft" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'light' ? <Moon /> : <Sun />}
    </IconButton>
  );
};

export default ThemeSwitch;