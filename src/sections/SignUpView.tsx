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
import GoogleIcon from '@mui/icons-material/Google';

export default function SignUpView() {
  const [acceptTerms, setAcceptTerms] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    if (!acceptTerms) {
      alert('Prosim akceptujte podmienky a GDPR');
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
          <Typography variant="h4" gutterBottom sx={{ color: 'text.primary' }}>
            Registrácia
          </Typography>
          <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }}>
            Prosim registrujte sa svojim google uctom
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
                Akceptujem{' '}
                <Link href="/podmienky" sx={{ color: 'blue', fontWeight: 'bold' }}>
                  Podmienky
                </Link>{' '}
                a{' '}
                <Link href="/gdpr" sx={{ color: 'blue', fontWeight: 'bold' }}>
                  gdpr
                </Link>
              </Typography>
            }
            sx={{
              marginTop: 2,
              marginBottom: 2,
              display: 'flex',
              alignItems: 'center', // Align checkbox and text vertically
              justifyContent: 'center',
            }}
          />
          <Button
            variant="outlined"
            fullWidth
            startIcon={<GoogleIcon />}
            onClick={handleSignUp}
            sx={{
              mt: 2,
              color: 'red',
              borderColor: 'red',
              height: '48px', // Same height as the sign-in button
              '&:hover': {
                bgcolor: 'rgba(255, 0, 0, 0.1)',
                borderColor: 'red',
              },
            }}
          >
            Registrujte sa účtom Google
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
