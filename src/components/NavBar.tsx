"use client";

import React from "react";
import { useSession } from "next-auth/react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Brightness3Icon from "@mui/icons-material/Brightness3";
import InfoIcon from "@mui/icons-material/Info";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import IconButton from "@mui/material/IconButton";
import { useRouter, usePathname } from "next/navigation";
import { useThemeContext } from "./ThemeProvider";
import ProfileButton from "./ProfileButton";

export default function SimpleBottomNavigation() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { toggleTheme, mode } = useThemeContext();

  // Create navigation links
  const links = [
    { label: "Domov", icon: <HomeIcon />, path: session ? "/prispevok" : "/" },
  ];

  // Add authenticated user links
  if (session) {
    links.push(
      { label: "Pridať príspevok", icon: <AddCircleIcon />, path: "/pridat" },
      { label: "Notifikácie", icon: <NotificationsIcon />, path: "/notifikacie" }
    );
  } else {
    links.push(
      { label: "O Mne", icon: <InfoIcon />, path: "/o-mne" },
      { label: "Prihlásiť sa", icon: <ExitToAppIcon />, path: "/auth/prihlasenie" },
      { label: "Registrovať sa", icon: <AppRegistrationIcon />, path: "/auth/registracia" }
    );
  }

  const activeIndex = links.findIndex((link) => link.path === pathname);

  return (
    <Box
      sx={{
        width: "100%",
        position: "fixed",
        bottom: 0,
        backgroundColor: mode === "dark" ? "rgba(33, 33, 33, 0.9)" : "#ffffff",
        zIndex: 1300,
        boxShadow: mode === "dark" ? "0px -2px 5px rgba(0, 0, 0, 0.3)" : "0px -2px 5px rgba(0, 0, 0, 0.1)",
        display: "flex",
        alignItems: "center",
        padding: "0",
        overflow: "hidden", // Prevent content from causing scrollbars
      }}
    >
      <BottomNavigation
        value={activeIndex >= 0 ? activeIndex : 0}
        onChange={(event, newValue) => {
          const link = links[newValue];
          if (link.path) {
            router.push(link.path);
          }
        }}
        sx={{
          backgroundColor: "transparent",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: 0,
        }}
      >
        {links.map((link, index) => (
          <BottomNavigationAction
            key={index}
            label={link.label}
            icon={link.icon}
            showLabel={true}
            sx={{
              color: activeIndex === index ? "#ff0000" : "#666666",
              "&.Mui-selected": {
                color: "#ff0000",
              },
              minWidth: { xs: '50px', sm: '70px' },
              padding: { xs: '6px 2px', sm: '6px 8px' },
            }}
          />
        ))}
        
        {/* Add profile button and theme toggle directly in the navigation */}
        {session && (
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: { xs: '40px', sm: '50px' },
            }}
          >
            <ProfileButton />
          </Box>
        )}
        
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: { xs: '40px', sm: '40px' },
          }}
        >
          <IconButton
            onClick={toggleTheme}
            size="small"
            sx={{
              color: mode === "dark" ? "#ffffff" : "#000000",
            }}
          >
            {mode === "dark" ? <Brightness7Icon /> : <Brightness3Icon />}
          </IconButton>
        </Box>
      </BottomNavigation>
    </Box>
  );
}
