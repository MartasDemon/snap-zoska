// src/components/Navbar.tsx
"use client";

import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import { useRouter } from 'next/navigation';  // For Next.js routing

export default function SimpleBottomNavigation() {
  const [value, setValue] = React.useState(0);
  const router = useRouter();

  return (
    <Box sx={{ width: '100%', position: 'fixed', bottom: 0 }}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);  // This will handle the selection and the blue color automatically
        }}
      >
        {/* Home Action */}
        <BottomNavigationAction 
          label="Domov" 
          icon={<HomeIcon />} 
          onClick={() => router.push('/')}  // Navigate to home
        />
        
        {/* Profile Action */}
        <BottomNavigationAction 
          label="Profil" 
          icon={<AccountCircleIcon />} 
          onClick={() => router.push('/profil')}  // Navigate to profile
        />
        
        {/* Add Profile Action */}
        <BottomNavigationAction 
          label="Pridať príspevok" 
          icon={<AddCircleIcon />} 
          onClick={() => router.push('/prispevok')}  // Navigate to add profile
        />
        
        {/* Logout Action */}
        <BottomNavigationAction 
          label="Prihlásenie" 
          icon={<ExitToAppIcon />} 
          onClick={() => router.push('/auth/prihlasenie')}  // Navigate to logout
        />
        
        {/* Registration Action */}
        <BottomNavigationAction 
          label="Registrácia" 
          icon={<AppRegistrationIcon />} 
          onClick={() => router.push('/auth/registracia')}  // Navigate to registration
        />
      </BottomNavigation>
    </Box>
  );
}