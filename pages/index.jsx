import { Button, Container } from "@mui/material";
import Meta from "components/meta";
import { getSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Home({ session }) {
  return (
    <>
      <Meta title="Home" index={false} />
      <Container maxWidth="md">
        <h1>App Schedule</h1>
        {!Boolean(session) ? (
          <Link href="/auth">
            <Button>Sign in</Button>
          </Link>
        ) : (
          <>
            <Link href="/agenda">
              <Button>Agenda</Button>
            </Link>
            <Button onClick={() => signOut()}>Sign out</Button>
          </>
        )}
      </Container>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
