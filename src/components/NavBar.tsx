"use client";

import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search'; 
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import PostAddIcon from '@mui/icons-material/PostAdd'; 
import { useSession, signOut, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <BottomNavigation
      showLabels
      style={{ position: 'fixed', bottom: 0, width: '100%', backgroundColor: 'white' }}
    >
      <BottomNavigationAction label="Domov" icon={<HomeIcon />} onClick={() => router.push('/')} />
      <BottomNavigationAction label="Príspevky" icon={<PostAddIcon />} onClick={() => router.push('/prispevok')} />


      {status === "authenticated" ? (
        <>
          <BottomNavigationAction label="Hľadať" icon={<SearchIcon />} onClick={() => router.push('/hladat')} />
          <BottomNavigationAction label="Profil" icon={<PersonIcon />} onClick={() => router.push('/profil')} />
          <BottomNavigationAction label="Odhlásiť sa" icon={<LogoutIcon />} onClick={() => signOut()} />
        </>
      ) : (
        <>
          <BottomNavigationAction label="Registrovať sa" icon={<PersonAddIcon />} onClick={() => router.push('/auth/prihlasenie')} />
          <BottomNavigationAction label="Prihlásiť sa" icon={<LoginIcon />} onClick={() => signIn()} />
        </>
      )}
    </BottomNavigation>
  );
}
