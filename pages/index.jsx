import { signOut, getSession } from "next-auth/react";
import Link from "next/link";

export default function Home({ session }) {
  if (session) {
    return (
      <div>
        Welcome user
        <br />
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }
  return (
    <div>
      Click to sign into your user account <br />
      <Link href="/auth/signin">Sign in</Link>
    </div>
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
