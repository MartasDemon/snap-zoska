// src/app/prispevok/[prispevokId]/page.tsx


import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

export const metadata = { title: "Detail prispevku | ZoškaSnap" };

export default function PostDetail({
  params,

}: {
  params: {
    prispevokid: string;
  };
}) {

  return (
    <Container>
      <Typography> Príspevok číslo: {params.prispevokid} </Typography>
    </Container>

      

  );
}