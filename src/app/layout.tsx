import type { Metadata } from "next";
import "./globals.css";
import SimpleBottomNavigation from "../components/NavBar";
import AuthProvider from "../components/AuthProvider"; 

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
        <AuthProvider>
          {children}
          <SimpleBottomNavigation /> {}
        </AuthProvider>
      </body>
    </html>
  );
}
