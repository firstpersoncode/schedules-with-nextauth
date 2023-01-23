import { getSession } from "next-auth/react";
import GlobalContextProvider, { getGlobalContext } from "context/global";
import Auth from "components/auth";
import Meta from "components/meta";

export default function AuthPage({ global }) {
  return (
    <GlobalContextProvider context={global}>
      <Meta title="Auth" index={false} />
      <Auth />
    </GlobalContextProvider>
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
    props: {
      global: getGlobalContext(context),
    },
  };
}
