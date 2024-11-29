// src/app/prispevok/[prispevokId]/page.tsx


import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

export const metadata = { title: "KOmentar prispevku | ZoškaSnap" };

export default function PostCommentDetail({
  params,

}: {
  params: {
    prispevokid: string;
    komentarid: string;
  };
}) {

  return (
    <Container>
      <Typography> Príspevok číslo: {params.prispevokid} </Typography>
      <Typography> Komentar Cislo: {params.komentarid} </Typography>
    </Container>

      

  );
}