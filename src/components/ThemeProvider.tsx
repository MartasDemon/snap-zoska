//src\components\ThemeProvider.tsx
"use client";

import React, { createContext, useState, useMemo, useContext } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline, GlobalStyles } from "@mui/material";


const ThemeContext = createContext({
  toggleTheme: () => {},
  mode: "light" as "light" | "dark",
});

export const useThemeContext = () => useContext(ThemeContext);

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
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
