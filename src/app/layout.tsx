// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import SimpleBottomNavigation from "../components/NavBar"; // Import the Bottom Navigation

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
        {children}
        <SimpleBottomNavigation /> {/* Add Bottom Navigation here */}
      </body>
    </html>
  );
}