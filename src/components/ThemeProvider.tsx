"use client";

import {
  Button,
  Container,
  Typography,
  Link as MuiLink,
  Box,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { signIn } from "next-auth/react";
import GoogleIcon from "@mui/icons-material/Google";
import Link from "next/link";

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
      {/* Title */}
      <Typography variant="h3" sx={{ mb: 3 }}>
        Prihlásenie
      </Typography>

      {/* Additional Text */}
      <Box sx={{ mb: 2, textAlign: "center" }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Ak sa chcete vidieť konkrétne podmienky,{" "}
          <Link href="/podmienky" passHref>
            <MuiLink
              sx={{
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
                cursor: "pointer",
              }}
            >
              kliknite sem
            </MuiLink>
          </Link>
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Checkbox />
          <Typography variant="body2">
            Súhlasíte s našimi podmienkami a pravidlami?
          </Typography>
        </Box>
      </Box>

      {/* Google Sign In */}
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
