"use client";

import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";

// Define a type for the session user
interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

const ProfileButton = () => {
  const { data: session } = useSession();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [imageError, setImageError] = useState(false);
  const router = useRouter();

  // Debug session data
  useEffect(() => {
    if (session) {
      console.log("ProfileButton - Session data:", session);
      console.log("ProfileButton - User image:", session.user?.image);
      
      // Pre-load the image to check if it loads correctly
      if (session.user?.image) {
        const img = new window.Image();
        img.onload = () => {
          console.log("Image loaded successfully");
          setImageError(false);
        };
        img.onerror = () => {
          console.log("Image failed to load");
          setImageError(true);
        };
        img.src = session.user.image;
      }
    }
  }, [session]);

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
    if (session?.user && 'id' in session.user) {
      const user = session.user as SessionUser;
      router.push(`/profil/${user.id}`);
    } else {
      router.push("/profil");
    }
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

  // Determine if we should show the image or fallback
  const showImage = session.user?.image && !imageError;
  // Type assertion for session.user
  const user = session.user as SessionUser;

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
      {showImage && user.image ? (
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Image
            src={user.image}
            alt={user.name || "Profile"}
            fill
            sizes="28px"
            style={{
              objectFit: 'cover',
            }}
            onError={() => setImageError(true)}
          />
        </Box>
      ) : (
        <Avatar
          sx={{ 
            width: 28, 
            height: 28,
            bgcolor: '#1976d2'
          }}
        >
          {user.name ? user.name.charAt(0).toUpperCase() : 
           user.email ? user.email.charAt(0).toUpperCase() : 'U'}
        </Avatar>
      )}

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
            {user.name || "User"}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
            {user.email || ""}
          </Typography>
        </Box>
        <MenuItem onClick={handleProfileNav}>Zobraziť profil</MenuItem>
        <MenuItem onClick={handleSignOut}>Odhlásiť sa</MenuItem>
      </Menu>
    </IconButton>
  );
};

export default ProfileButton; 