// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import SimpleBottomNavigation from "../components/NavBar";
import AuthProvider from "../components/AuthProvider";
import ThemeProvider from "../components/ThemeProvider";

export const metadata: Metadata = {
  title: "SnapZoska",
  description: "Created by student Martin Mihalik",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
