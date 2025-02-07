'use client';

import React from 'react';
import { signIn } from 'next-auth/react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import GoogleIcon from '@mui/icons-material/Google';

export default function SignInView() {
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
            Prihlásenie
          </Typography>
          <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }}>
            Prihláste sa pomocou vášho Google účtu.
          </Typography>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<GoogleIcon />}
            onClick={() => signIn('google')}
            sx={{
              mt: 2,
              color: 'red',
              borderColor: 'red',
              '&:hover': {
                bgcolor: 'rgba(255, 0, 0, 0.1)',
                borderColor: 'red',
              },
            }}
          >
            Prihlásiť sa účtom Google
          </Button>
          <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
            Ešte nemáte účet?{' '}
            <Link href="/auth/registracia" sx={{ color: 'blue', fontWeight: 'bold' }}>
              Registrujte sa
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
