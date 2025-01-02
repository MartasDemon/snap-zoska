"use client";

import {
  Button,
  Container,
  Typography,
  Link,
} from "@mui/material";
import { signIn } from "next-auth/react";
import GoogleIcon from "@mui/icons-material/Google";

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
      <Typography variant="h5" sx={{ mb: 3 }}>
        Prihlásenie
      </Typography>
      
      <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
        Ešte nemáte účet?{" "}
        <Link
          href="/auth/registracia"
          sx={{ color: "blue", fontWeight: "bold" }}
        >
          Registrujte sa
        </Link>
      </Typography>

      <Button
        variant="outlined"
        fullWidth
        startIcon={<GoogleIcon />}
        onClick={() => signIn("google")}
        sx={{
          mb: 1,
          color: "red",
          borderColor: "red",
          "&:hover": {
            backgroundColor: "rgba(255, 0, 0, 0.1)",
            borderColor: "red",
          },
        }}
      >
        Prihlásiť sa účtom Google
      </Button>


    </Container>
  );
}
