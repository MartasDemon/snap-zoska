import type { Metadata } from "next";
import "./globals.css";
import SimpleBottomNavigation from "../components/NavBar"; // Import the Bottom Navigation
import AuthProvider from "../components/AuthProvider"; // Import your custom AuthProvider

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
          <SimpleBottomNavigation /> {/* Add Bottom Navigation here */}
        </AuthProvider>
      </body>
    </html>
  );
}
