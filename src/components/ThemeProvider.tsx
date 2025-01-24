"use client";

import React, { createContext, useState, useMemo, useContext, useEffect } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline, GlobalStyles } from "@mui/material";

const ThemeContext = createContext({
  toggleTheme: () => {},
  mode: "light" as "light" | "dark",
});

export const useThemeContext = () => useContext(ThemeContext);

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [isClient, setIsClient] = useState(false); // State to track client-side rendering

  // Only run this effect in the client-side environment
  useEffect(() => {
    setIsClient(true); // Set client-side flag to true after mounting on the client
    const savedMode = localStorage.getItem("themeMode") as "light" | "dark";
    if (savedMode) {
      setMode(savedMode);
    }
  }, []);

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light";
      if (isClient) { // Make sure localStorage is accessed only on the client-side
        localStorage.setItem("themeMode", newMode);
      }
      return newMode;
    });
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          background: {
            default: mode === "light" ? "#ffffff" : "#121212", // Site background
          },
          text: {
            primary: mode === "light" ? "#000000" : "#ffffff", // Text color
          },
        },
      }),
    [mode]
  );

  // Render nothing if it's SSR (server-side rendering)
  if (!isClient) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ toggleTheme, mode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles
          styles={{
            body: {
              backgroundColor: theme.palette.background.default,
              color: theme.palette.text.primary,
              transition: "background-color 0.3s, color 0.3s", // Smooth transition
            },
          }}
        />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
