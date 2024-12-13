"use client";

import "./globals.css";
import SimpleBottomNavigation from "../components/NavBar";
import AuthProvider from "../components/AuthProvider";
import ThemeProvider from "../components/ThemeProvider";

export const metadata = {
  title: "SnapZoska",
  description: "Created by student Martin Mihálik",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sk">
      <body>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <SimpleBottomNavigation />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
