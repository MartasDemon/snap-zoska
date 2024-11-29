// src/app/(auth)/layout.tsx

export const metadata = { title: "Authentication | SnapZoška" };

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {children} {/* Render authentication pages */}
    </div>
  );
}

