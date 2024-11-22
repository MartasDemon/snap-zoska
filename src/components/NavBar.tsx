"use client";

import * as React from 'react';
import { getSession, signOut } from 'next-auth/react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useRouter } from 'next/navigation';
import { Session } from 'next-auth';

export default function SimpleBottomNavigation() {
  const [value, setValue] = React.useState(0);
  const [session, setSession] = React.useState<Session | null>(null);
  const router = useRouter();

  // Fetch session on component mount
  React.useEffect(() => {
    getSession().then(setSession);
  }, []);

  return (
    <Box sx={{ width: '100%', position: 'fixed', bottom: 0 }}>
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        {/* Home Action */}
        <BottomNavigationAction 
          label="Domov" 
          icon={<HomeIcon />} 
          showLabel={true} // Explicitly show label
          onClick={() => router.push('/')} 
        />

        {session ? (
          <>
            {/* Profile Action */}
            <BottomNavigationAction 
              label={`Profil (${session.user?.name})`} 
              icon={<AccountCircleIcon />} 
              showLabel={true} // Explicitly show label
              onClick={() => router.push('/profil')} 
            />

            {/* Add Post Action */}
            <BottomNavigationAction 
              label="Pridať príspevok" 
              icon={<AddCircleIcon />} 
              showLabel={true} // Explicitly show label
              onClick={() => router.push('/prispevok')} 
            />

            {/* Notifications Action */}
            <BottomNavigationAction 
              label="Notifikácie" 
              icon={<NotificationsIcon />} 
              showLabel={true} // Explicitly show label
              onClick={() => router.push('/notifikacie')} 
            />

            {/* Logout Action */}
            <BottomNavigationAction 
              label="Odhlásiť sa" 
              icon={<ExitToAppIcon />} 
              showLabel={true} // Explicitly show label
              onClick={() => signOut()} 
            />
          </>
        ) : (
          <>
            {/* Posts Action */}
            <BottomNavigationAction 
              label="Príspevky" 
              icon={<AddCircleIcon />} 
              showLabel={true} // Explicitly show label
              onClick={() => router.push('/prispevok')} 
            />

            {/* Login Action */}
            <BottomNavigationAction 
              label="Prihlásenie" 
              icon={<ExitToAppIcon />} 
              showLabel={true} // Explicitly show label
              onClick={() => router.push('/auth/prihlasenie')} 
            />

            {/* Registration Action */}
            <BottomNavigationAction 
              label="Registrácia" 
              icon={<AppRegistrationIcon />} 
              showLabel={true} // Explicitly show label
              onClick={() => router.push('/auth/registracia')} 
            />
          </>
        )}
      </BottomNavigation>
    </Box>
  );
}