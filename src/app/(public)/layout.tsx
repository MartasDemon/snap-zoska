// src/app/(public)/layout.tsx

export const metadata = { title: "Verejné | SnapZoška" };

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {children} {/* Render public pages */}
    </div>
  );
}
