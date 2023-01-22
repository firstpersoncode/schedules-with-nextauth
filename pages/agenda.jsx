import { getSession } from "next-auth/react";
import AgendaContextProvider from "context/agenda";
import SessionContextProvider from "context/session";
import Meta from "components/meta";
import Agenda from "components/agenda";

export default function AgendaPage({ session }) {
  return (
    <>
      <Meta title="Agenda" index={false} />
      <SessionContextProvider context={session}>
        <AgendaContextProvider>
          <Agenda />
        </AgendaContextProvider>
      </SessionContextProvider>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    context.res.writeHead(302, {
      Location: "/auth",
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
