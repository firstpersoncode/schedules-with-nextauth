import Auth from "components/auth";
import { getSession } from "next-auth/react";

export default function AuthPage() {
  return <Auth />;
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (session) {
    context.res.writeHead(302, {
      Location: "/schedule",
    });
    context.res.end();
  }

  return {
    props: {},
  };
}
