import { getSession } from "next-auth/react";
import Auth from "components/auth";

export default function AuthPage() {
  return <Auth />;
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (session) {
    context.res.writeHead(302, {
      Location: "/",
    });
    context.res.end();
  }

  return {
    props: {},
  };
}
