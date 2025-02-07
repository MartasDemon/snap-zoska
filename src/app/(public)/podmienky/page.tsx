// src/app/(public)/podmienky/page.tsx
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "next/link"; // Import Link from Next.js

export const metadata = { title: "Podmienky používania | ZoskaSnap" };

export default function TermsAndConditions() {
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom sx={{ color: "red" }}>
          Podmienky používania
        </Typography>
        <Typography variant="body1" paragraph>
          Používaním našej platformy súhlasíte s týmito podmienkami. Prosím, prečítajte si ich pozorne.
        </Typography>

        <Box mt={2}>
          <Typography variant="h6">1. Použitie služby</Typography>
          <Typography variant="body2" paragraph>
            Naša platforma je určená na zdieľanie a objavovanie obsahu. Používatelia nesmú zverejňovať nevhodný obsah.
          </Typography>
        </Box>

        <Box mt={2}>
          <Typography variant="h6">2. Ochrana osobných údajov</Typography>
          <Typography variant="body2" paragraph>
            Vaše údaje sú spracovávané v súlade s GDPR. Viac informácií nájdete v našich zásadách ochrany osobných údajov.
          </Typography>
        </Box>

        <Box mt={2}>
          <Typography variant="h6">3. Zodpovednosť</Typography>
          <Typography variant="body2" paragraph>
            Používateľ nesie zodpovednosť za obsah, ktorý publikuje. Prevádzkovateľ nenesie zodpovednosť za obsah tretích strán.
          </Typography>
        </Box>

        {/* Button to navigate back to registration page */}
        <Box mt={4}>
          <Link href="/auth/registracia" passHref>
            <Button variant="contained" sx={{ backgroundColor: "red", color: "white" }}>
              Naspäť na registráciu
            </Button>
          </Link>
        </Box>
      </Paper>
    </Container>
  );
}
