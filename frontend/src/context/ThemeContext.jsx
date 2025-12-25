import { createContext, useContext, useState, useEffect } from "react"; // React hooks for context, state, and effects

// Create theme context - will hold current theme and toggle function
const ThemeContext = createContext(null);

// ThemeProvider component - Provides theme state to all child components
export const ThemeProvider = ({ children }) => {
  // Initialize theme state with value from localStorage or system preference
  const [theme, setTheme] = useState(() => {
    // Check localStorage first for user's saved preference
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored) return stored; // Use stored theme if available
      
      // Fall back to system preference (prefers-color-scheme media query)
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark'; // System prefers dark mode
      }
    }
    return 'light'; // Default to light theme
  });

  // Effect to apply theme changes to DOM and persist to localStorage
  useEffect(() => {
    const root = document.documentElement; // Get the <html> element
    
    // Add or remove 'dark' class on document root for CSS dark mode
    if (theme === 'dark') {
      root.classList.add('dark'); // Enable dark mode CSS
    } else {
      root.classList.remove('dark'); // Disable dark mode CSS
    }
    
    localStorage.setItem('theme', theme); // Persist theme choice to localStorage
  }, [theme]); // Run effect when theme changes

  // Function to toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light'); // Switch theme
  };

  // Provide theme context values to all child components
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to access theme context - use this in components to get theme state/toggle
export const useTheme = () => {
  const context = useContext(ThemeContext);
  // Throw error if hook is used outside of ThemeProvider
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
