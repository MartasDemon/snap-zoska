"use client";

import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const ProfileButton = () => {
  const { data: session } = useSession();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();

  // Simple debug log
  console.log("ProfileButton rendering, session:", session?.user?.name, "image:", session?.user?.image);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    // Prevent default behavior to avoid any page shifts
    event.preventDefault();
    event.stopPropagation();
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

  // Don't render anything if not logged in
  if (!session) {
    return null;
  }

  return (
    <IconButton
      onClick={handleProfileClick}
      size="small"
      aria-controls={Boolean(anchorEl) ? "profile-menu" : undefined}
      aria-haspopup="true"
      aria-expanded={Boolean(anchorEl) ? "true" : undefined}
      sx={{
        p: 0.5,
        width: 36,
        height: 36,
        position: 'relative',
      }}
    >
      <Avatar
        src={session.user?.image || undefined}
        alt={session.user?.name || "Profile"}
        sx={{ 
          width: 28, 
          height: 28,
          bgcolor: '#1976d2'
        }}
      >
        {session.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
      </Avatar>

      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside menu from closing it
        disableScrollLock={true} // Prevent scroll locking which can cause shifts
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        slotProps={{
          paper: {
            onClick: (e) => e.stopPropagation() // Prevent clicks on menu paper from closing it
          }
        }}
        MenuListProps={{
          'aria-labelledby': 'profile-button',
        }}
        sx={{
          '& .MuiPaper-root': {
            minWidth: 180,
            boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)',
          }
        }}
      >
        <Box sx={{ px: 2, py: 1, borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            {session.user?.name || "User"}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
            {session.user?.email || ""}
          </Typography>
        </Box>
        <MenuItem onClick={handleProfileNav}>Zobraziť profil</MenuItem>
        <MenuItem onClick={handleSignOut}>Odhlásiť sa</MenuItem>
      </Menu>
    </IconButton>
  );
};

export default ProfileButton; 