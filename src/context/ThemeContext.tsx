import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeMode, ThemeConfig, THEMES } from '@/types/theme';

interface ThemeContextType {
  theme: ThemeMode;
  themeConfig: ThemeConfig;
  setTheme: (theme: ThemeMode) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (val: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'inema-light';

  const pathname = window.location.pathname.toLowerCase();
  if (pathname.includes('proposta-verde-azul') || pathname.includes('verde-azul') || pathname.includes('vizora-blue') || pathname.includes('sidebar-azul')) return 'vizora-blue';
  if (pathname.includes('proposta-verde') || pathname.includes('sidebar-verde') || pathname.includes('vizora-green')) return 'vizora-green';
  if (pathname.includes('proposta-branca') || pathname.includes('sidebar-branca') || pathname.includes('inema-light') || pathname.includes('light-shell')) return 'inema-light';
  if (pathname.includes('proposta-02') || pathname.includes('inema-forest') || pathname.includes('dark-forest')) return 'vizora-green';

  const searchParams = new URLSearchParams(window.location.search);
  const temaParam = searchParams.get('tema') || searchParams.get('theme') || searchParams.get('c');
  if (temaParam === 'verde-azul' || temaParam === 'proposta-verde-azul' || temaParam === 'vizora-blue') return 'vizora-blue';
  if (temaParam === 'verde' || temaParam === 'proposta-verde' || temaParam === 'vizora-green') return 'vizora-green';
  if (temaParam === 'branca' || temaParam === 'proposta-branca' || temaParam === 'inema-light') return 'inema-light';
  if (temaParam === 'proposta-02' || temaParam === 'inema-forest') return 'vizora-green';

  const stored = localStorage.getItem('inema_theme_mode') as ThemeMode;
  if (stored && stored !== 'inema-forest' && THEMES[stored] && searchParams.get('layout') === 'novo') return stored;

  return 'inema-light';
}

function getInitialDarkMode(): boolean {
  if (typeof window === 'undefined') return false;
  const searchParams = new URLSearchParams(window.location.search);
  const darkParam = searchParams.get('dark') || searchParams.get('modo') || searchParams.get('mode');
  if (darkParam === 'true' || darkParam === 'dark' || darkParam === '1') {
    return true;
  }
  const stored = localStorage.getItem('inema_dark_mode');
  if (stored !== null) {
    return stored === 'true';
  }
  return false;
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(getInitialTheme);
  const [isDarkMode, setIsDarkModeState] = useState<boolean>(getInitialDarkMode);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('inema_theme_mode', newTheme);
      window.dispatchEvent(new Event('inema_theme_changed'));
    } catch {
      // Ignora erro
    }
  };

  const setDarkMode = (val: boolean) => {
    setIsDarkModeState(val);
    try {
      localStorage.setItem('inema_dark_mode', val ? 'true' : 'false');
      window.dispatchEvent(new Event('inema_dark_changed'));
    } catch {
      // Ignora erro
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!isDarkMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handlePopState = () => {
      setThemeState(getInitialTheme());
    };
    const handleStorageChange = () => {
      const storedTheme = localStorage.getItem('inema_theme_mode') as ThemeMode;
      if (storedTheme && THEMES[storedTheme]) {
        setThemeState(storedTheme);
      }
      const storedDark = localStorage.getItem('inema_dark_mode');
      if (storedDark !== null) {
        setIsDarkModeState(storedDark === 'true');
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('inema_theme_changed', handleStorageChange);
    window.addEventListener('inema_dark_changed', handleStorageChange);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('inema_theme_changed', handleStorageChange);
      window.removeEventListener('inema_dark_changed', handleStorageChange);
    };
  }, []);

  const themeConfig = THEMES[theme] || THEMES.default;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeConfig,
        setTheme,
        isDarkMode,
        toggleDarkMode,
        setDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
