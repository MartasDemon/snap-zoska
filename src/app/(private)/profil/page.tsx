// src/app/profil/page.tsx
"use client";

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { CircularProgress, Container, Typography } from '@mui/material';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (session?.user && 'id' in session.user) {
      // Redirect to the user's profile page
      router.push(`/profil/${session.user.id}`);
    } else if (status === 'unauthenticated') {
      // Redirect to login if not authenticated
      router.push('/auth/prihlasenie');
    }
  }, [session, status, router]);

  // Show loading while checking session
  return (
    <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
      <CircularProgress />
    </Container>
  );
} 
