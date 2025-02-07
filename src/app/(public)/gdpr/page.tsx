import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "next/link"; // Import Link from Next.js

export const metadata = { title: "GDPR | ZoskaSnap" };

export default function Gdpr() {
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom sx={{ color: "red", textAlign: "center" }}>
          Zásady ochrany osobných údajov (GDPR)
        </Typography>
        <Typography variant="body1" paragraph>
          Vaše súkromie je pre nás dôležité. Táto stránka vysvetľuje, ako zhromažďujeme, používame a chránime vaše osobné údaje v súlade s nariadením GDPR.
        </Typography>

        <Box mt={2}>
          <Typography variant="h6" sx={{ textAlign: "center" }}>1. Aké údaje zhromažďujeme?</Typography>
          <Typography variant="body2" paragraph>
            Môžeme zhromažďovať vaše meno, e-mailovú adresu a ďalšie informácie, ktoré nám dobrovoľne poskytnete.
          </Typography>
        </Box>

        <Box mt={2}>
          <Typography variant="h6" sx={{ textAlign: "center" }}>2. Ako používame vaše údaje?</Typography>
          <Typography variant="body2" paragraph>
            Používame vaše údaje na poskytovanie služieb, zlepšovanie našej platformy a zabezpečenie vašej bezpečnosti.
          </Typography>
        </Box>

        <Box mt={2}>
          <Typography variant="h6" sx={{ textAlign: "center" }}>3. Vaše práva</Typography>
          <Typography variant="body2" paragraph>
            Máte právo na prístup, opravu alebo vymazanie svojich údajov. Môžete tiež požiadať o obmedzenie spracovania alebo prenos údajov.
          </Typography>
        </Box>

        <Box mt={2}>
          <Typography variant="h6" sx={{ textAlign: "center" }}>4. Ochrana vašich údajov</Typography>
          <Typography variant="body2" paragraph>
            Používame bezpečnostné opatrenia na ochranu vašich údajov pred neoprávneným prístupom alebo zneužitím.
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
