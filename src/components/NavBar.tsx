"use client";

import * as React from "react";
import { getSession, signOut } from "next-auth/react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useRouter, usePathname } from "next/navigation";
import { Session } from "next-auth";
import { useThemeContext } from "./ThemeProvider";

export default function SimpleBottomNavigation() {
  const [session, setSession] = React.useState<Session | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { toggleTheme } = useThemeContext(); // Use theme toggler from ThemeProvider

  const links = session
    ? [
        { label: "Domov", icon: <HomeIcon />, path: "/prispevok" },
        { label: `Profil (${session.user?.name})`, icon: <AccountCircleIcon />, path: "/profil" },
        { label: "Pridať príspevok", icon: <AddCircleIcon />, path: "/pridat" },
        { label: "Notifikácie", icon: <NotificationsIcon />, path: "/notifikacie" },
        { label: "Odhlásiť sa", icon: <ExitToAppIcon />, action: () => signOut() },
        { label: "Zmeniť tému", icon: <HomeIcon />, action: toggleTheme }, // Theme toggler
      ]
    : [
        { label: "Domov", icon: <HomeIcon />, path: "/" },
        { label: "GDPR", icon: <HomeIcon />, path: "/gdpr" },
        { label: "O Mne", icon: <HomeIcon />, path: "/o-mne" },
        { label: "Podmienky", icon: <HomeIcon />, path: "/podmienky" },
        { label: "Prihlásiť sa", icon: <ExitToAppIcon />, path: "/auth/prihlasenie" },
        { label: "Registrovať sa", icon: <AppRegistrationIcon />, path: "/auth/registracia" },
        { label: "Zmeniť tému", icon: <HomeIcon />, action: toggleTheme }, // Theme toggler
      ];

  // Fetch session on component mount
  React.useEffect(() => {
    getSession().then(setSession);
  }, []);

  // Determine the active index based on the current path
  const activeIndex = links.findIndex((link) => link.path === pathname);

  return (
    <Box sx={{ width: "100%", position: "fixed", bottom: 0 }}>
      <BottomNavigation
        value={activeIndex >= 0 ? activeIndex : 0} // Default to 0 if no match
        onChange={(event, newValue) => {
          const link = links[newValue];
          if (link.action) {
            link.action(); // Perform custom action
          } else if (link.path) {
            router.push(link.path); // Navigate to path
          }
        }}
      >
        {links.map((link, index) => (
          <BottomNavigationAction
            key={index}
            label={link.label}
            icon={link.icon}
            showLabel={true}
          />
        ))}
      </BottomNavigation>
    </Box>
  );
}
