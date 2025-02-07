import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";

export const metadata = { title: "O-mne | ZoskaSnap" };

export default function AboutMe() {
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom sx={{ color: "red" }}>
          O mne
        </Typography>
        <Avatar
          src="https://randomuser.me/api/portraits/men/1.jpg"
          alt="Creator of ZoskaSnap"
          sx={{ width: 120, height: 120, margin: "auto", mb: 2 }}
        />
        <Typography variant="body1" paragraph>
          Ahoj! Som tvorca ZoskaSnap, vášnivý vývojár so záujmom o moderné technológie a dizajn.
          Môj cieľ je prinášať kvalitný a inovatívny obsah pre všetkých používateľov.
        </Typography>
        <Typography variant="body2" paragraph>
          Sleduj moje projekty a nechaj sa inšpirovať mojou cestou v programovaní a tvorbe webových aplikácií!
        </Typography>
      </Paper>
    </Container>
  );
}
