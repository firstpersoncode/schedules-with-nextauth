import { Button, Container } from "@mui/material";
import { getSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Schedule({ session }) {
  return (
    <Container maxWidth="md">
      <h1>App Schedule</h1>
      <Button onClick={() => signOut()}>Sign out</Button>
    </Container>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    context.res.writeHead(302, {
      Location: "/auth/signin",
    });
    context.res.end();

    return {
      props: {},
    };
  }

  return {
    props: {
      session,
    },
  };
}
