import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: (event?: React.MouseEvent<HTMLElement>) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      return savedTheme;
    }
    // Default to dark as per original design, or check system preference
    // return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    return 'dark'; // Defaulting to dark to maintain consistency with previous behavior
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = (event?: React.MouseEvent<HTMLElement>) => {
    const newTheme = theme === 'light' ? 'dark' : 'light';

    // Check if browser supports View Transitions API
    if (!document.startViewTransition) {
      setTheme(newTheme);
      return;
    }

    // Get click coordinates for the animation origin
    const x = event?.clientX ?? window.innerWidth / 2;
    const y = event?.clientY ?? window.innerHeight / 2;

    // Calculate the maximum radius needed to cover the entire viewport
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // Set CSS variables for the animation
    document.documentElement.style.setProperty('--x', `${x}px`);
    document.documentElement.style.setProperty('--y', `${y}px`);
    document.documentElement.style.setProperty('--r', `${endRadius}px`);

    // Start the view transition
    const transition = document.startViewTransition(() => {
      setTheme(newTheme);
    });

    // Wait for the transition to be ready
    transition.ready.then(() => {
      // Animation is handled by CSS
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
