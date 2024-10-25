// src/sections/SignInView.tsx

"use client";

import {
    Button,
    Checkbox,
    Container,
    FormControlLabel,
    TextField,
    Typography,
    Divider,
  } from "@mui/material";
  import { signIn } from "next-auth/react";
  import GoogleIcon from "@mui/icons-material/Google";
  import FacebookIcon from "@mui/icons-material/Facebook";

export default function SignInView() {
  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 5,
        p: 3,
        bgcolor: "background.paper",
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      {/* Logo / Title */}
      <Typography variant="h5" sx={{ mb: 3 }}>
        Prihlásenie
      </Typography>

      {/* Google Sign Up */}
      <Button
        variant="outlined"
        fullWidth
        startIcon={<GoogleIcon />}
        onClick={() => signIn("google")}
        sx={{ mb: 1 }}
      >
        Prihlásiť sa účtom Google
      </Button>


    </Container>
  );
}