import { getSession } from "next-auth/react";

export default function Protected() {
  return (
    <div>
      <h1>Protected Page</h1>
    </div>
  );
}
export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    context.res.writeHead(302, {
      Location: "/api/auth/signin?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2F",
    });
    context.res.end();
    return { props: {} };
  }
  return {
    props: {
      user: session.user,
    },
  };
}
