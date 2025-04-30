"use client";

import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";

// ThemeProvider Component
// Why this approach:
// 1. Context API: Uses React Context for global theme state accessible anywhere in the app
// 2. System preference detection: Respects user's OS-level theme preference for a better UX
// 3. Persistence: Remembers user preference with localStorage to maintain consistency across visits
// 4. CSS variables: Uses data attributes and CSS variables for theme switching without flash of unstyled content
// 5. Progressive enhancement: Works with or without JavaScript by defaulting to system preference
// 6. Extensibility: Structured to allow additional themes beyond just light/dark if needed later

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  attribute?: string;
  enableSystem?: boolean;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(
  undefined
);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  attribute = "data-theme",
  enableSystem = true,
  ...props
}: ThemeProviderProps) {
  // Local state for current theme - initialized with default preference
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  // Initial mount effect - load saved preference if available
  useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey);

    if (savedTheme) {
      setTheme(savedTheme as Theme);
    } else if (enableSystem) {
      setTheme("system");
    }
  }, [storageKey, enableSystem]);

  // Theme application effect - applies theme to DOM and handles system changes
  useEffect(() => {
    const root = window.document.documentElement;
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

    const updateTheme = () => {
      if (theme === "system") {
        if (prefersDarkScheme.matches) {
          root.setAttribute(attribute, "dark");
        } else {
          root.removeAttribute(attribute);
        }
      } else if (theme === "dark") {
        root.setAttribute(attribute, "dark");
      } else {
        root.removeAttribute(attribute);
      }
    };

    updateTheme();

    // Save the theme to localStorage
    if (theme !== "system") {
      localStorage.setItem(storageKey, theme);
    }

    // Listen for system theme changes
    const handleMediaChange = () => {
      if (theme === "system") {
        updateTheme();
      }
    };

    prefersDarkScheme.addEventListener("change", handleMediaChange);

    return () => {
      prefersDarkScheme.removeEventListener("change", handleMediaChange);
    };
  }, [theme, storageKey, attribute]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
