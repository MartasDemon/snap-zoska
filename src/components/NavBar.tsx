"use client";

import React, { useEffect, useState } from "react";
import { getSession, signOut } from "next-auth/react";
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
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import { useRouter, usePathname } from "next/navigation";
import { useThemeContext } from "./ThemeProvider";
import { Session } from "next-auth";

export default function SimpleBottomNavigation() {
  const [session, setSession] = useState<Session | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { toggleTheme, mode } = useThemeContext();

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileNav = () => {
    router.push("/profil");
    handleClose();
  };

  const handleSignOut = () => {
    signOut();
    handleClose();
  };

  useEffect(() => {
    const loadSession = async () => {
      const userSession = await getSession();
      setSession(userSession);
      console.log("User session:", userSession);
    };
    loadSession();
  }, []);

  const links = session
    ? [
        { label: "Domov", icon: <HomeIcon />, path: "/prispevok" },
        { label: "Pridať príspevok", icon: <AddCircleIcon />, path: "/pridat" },
        { label: "Notifikácie", icon: <NotificationsIcon />, path: "/notifikacie" },
        {
          label: session.user?.name || "Profil",
          icon: (
            <Avatar
              src={session.user?.image || undefined}
              alt={session.user?.name || "Profile"}
              sx={{ width: 24, height: 24, cursor: 'pointer' }}
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                e.stopPropagation();
                handleProfileClick(e);
              }}
            />
          ),
          path: "#"
        },
      ]
    : [
        { label: "Domov", icon: <HomeIcon />, path: "/" },
        { label: "O Mne", icon: <InfoIcon />, path: "/o-mne" },
        { label: "Prihlásiť sa", icon: <ExitToAppIcon />, path: "/auth/prihlasenie" },
        { label: "Registrovať sa", icon: <AppRegistrationIcon />, path: "/auth/registracia" },
      ];

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
        justifyContent: "space-between",
        alignItems: "center",
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
          flex: 1,
          display: "flex",
          gap: 5,
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
            }}
          />
        ))}
      </BottomNavigation>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleProfileNav}>Zobraziť profil</MenuItem>
        <MenuItem onClick={handleSignOut}>Odhlásiť sa</MenuItem>
      </Menu>

      <Box sx={{ pr: 1 }}>
        <BottomNavigationAction
          label="Zmeniť tému"
          icon={mode === "dark" ? <Brightness7Icon /> : <Brightness3Icon />}
          onClick={toggleTheme}
          sx={{
            color: mode === "dark" ? "#ffffff" : "#000000",
            minWidth: "48px",
          }}
        />
      </Box>
    </Box>
  );
}
