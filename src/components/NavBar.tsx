"use client";

import React, { useEffect, useState } from "react";
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
import Brightness7Icon from "@mui/icons-material/Brightness7"; // Sun icon
import Brightness3Icon from "@mui/icons-material/Brightness3"; // Moon icon
import InfoIcon from "@mui/icons-material/Info"; // About icon
import { useRouter, usePathname } from "next/navigation";
import { useThemeContext } from "./ThemeProvider";
import { Session } from "next-auth";

export default function SimpleBottomNavigation() {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { toggleTheme, mode } = useThemeContext();

  const links = session
    ? [
        { label: "Domov", icon: <HomeIcon />, path: "/prispevok" },
        { label: `Profil (${session.user?.name})`, icon: <AccountCircleIcon />, path: "/profil" },
        { label: "Pridať príspevok", icon: <AddCircleIcon />, path: "/pridat" },
        { label: "Notifikácie", icon: <NotificationsIcon />, path: "/notifikacie" },
        { label: "Odhlásiť sa", icon: <ExitToAppIcon />, action: () => signOut() },
      ]
    : [
        { label: "Domov", icon: <HomeIcon />, path: "/" },
        { label: "O Mne", icon: <InfoIcon />, path: "/o-mne" },
        { label: "Prihlásiť sa", icon: <ExitToAppIcon />, path: "/auth/prihlasenie" },
        { label: "Registrovať sa", icon: <AppRegistrationIcon />, path: "/auth/registracia" },
      ];

  useEffect(() => {
    getSession().then(setSession);
  }, []);

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
        justifyContent: "space-between", // Space between icons and the theme button
        alignItems: "center",
      }}
    >
      <BottomNavigation
        value={activeIndex >= 0 ? activeIndex : 0}
        onChange={(event, newValue) => {
          const link = links[newValue];
          if (link.action) {
            link.action();
          } else if (link.path) {
            router.push(link.path);
          }
        }}
        sx={{
          backgroundColor: "transparent",
          flex: 1,
          display: "flex", // Ensure all icons are in one line// Tighter spacing between icons
          gap: 5
        }}
      >
        {links.map((link, index) => (
          <BottomNavigationAction
            key={index}
            label={link.label}
            icon={link.icon}
            showLabel={true}
            sx={{
              color: activeIndex === index ? "#ff0000" : "#666666", // Selected: Red, Default: Gray
              "&.Mui-selected": {
                color: "#ff0000",
              },
            }}
          />
        ))}
      </BottomNavigation>

      {/* Theme Toggle Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 0px", // Reduce padding around the button
          flexShrink: 0, // Prevent the button from taking up excessive space
        }}
      >
        <BottomNavigationAction
          label="Zmeniť tému"
          icon={mode === "dark" ? <Brightness7Icon /> : <Brightness3Icon />}
          onClick={toggleTheme}
          sx={{
            color: mode === "dark" ? "#ffffff" : "#000000", // White in dark mode, black in light mode
            minWidth: "48px", // Set a fixed width for the button
          }}
        />
      </Box>
    </Box>
  );
}
