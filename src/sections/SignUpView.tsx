// src/sections/SignUpView.tsx

'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';

export default function SignUpView() {
  const [acceptTerms, setAcceptTerms] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    if (!acceptTerms) {
      alert('Please accept the terms and conditions to proceed.');
      return; // Exit the function if terms are not accepted
    }

    const result = await signIn('google', { callbackUrl: '/' });
    if (result?.ok) {
      router.push('/');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Card
        sx={{
          width: 400,
          padding: '20px',
          bgcolor: 'background.paper',
          color: 'text.primary',
        }}
      >
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ color: 'text.primary' }}
          >
            Registrácia
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            sx={{ color: 'text.secondary' }}
          >
            Please sign up using your Google account.
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                I accept the{' '}
                <Link href="/podmienky" color="primary">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/gdpr" color="primary">
                  GDPR Policy
                </Link>
              </Typography>
            }
            sx={{ marginTop: 2, marginBottom: 2 }}
          />
          <Button
            variant="outlined" // Outlined button style
            color="primary"
            onClick={handleSignUp}
            sx={{
              marginTop: '20px',
              borderColor: '#ff0000', // Red border
              color: '#ff0000', // Red text
              '&:hover': {
                bgcolor: 'transparent', // No background on hover
                borderColor: '#cc0000', // Darker red border on hover
                color: '#cc0000', // Darker red text on hover
              },
            }}
          >
            Register with Google
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
