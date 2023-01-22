import Auth from "components/auth";
import Meta from "components/meta";
import { getSession } from "next-auth/react";

export default function AuthPage() {
  return (
    <>
      <Meta title="Auth" index={false} />
      <Auth />
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (session) {
    context.res.writeHead(302, {
      Location: "/agenda",
    });
    context.res.end();
  }

  return {
    props: {},
  };
}
