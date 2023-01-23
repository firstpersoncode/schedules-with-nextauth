import { getSession } from "next-auth/react";
import AgendaContextProvider from "context/agenda";
import SessionContextProvider from "context/session";
import GlobalContextProvider, { getGlobalContext } from "context/global";
import Meta from "components/meta";
import Agenda from "components/agenda";

export default function AgendaPage({ global, session }) {
  return (
    <GlobalContextProvider context={global}>
      <Meta title="Agenda" index={false} />
      <SessionContextProvider context={session}>
        <AgendaContextProvider>
          <Agenda />
        </AgendaContextProvider>
      </SessionContextProvider>
    </GlobalContextProvider>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    context.res.writeHead(302, {
      Location: "/auth",
    });
    context.res.end();
  }

  return {
    props: {
      global: getGlobalContext(context),
      session,
    },
  };
}
