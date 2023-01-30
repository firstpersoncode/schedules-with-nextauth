import { getSession } from "next-auth/react";
import CommonContextProvider, { getCommonContext } from "context/common";
import SessionContextProvider from "context/session";
import Board from "components/board";

export default function BoardPage({ common, session }) {
  return (
    <CommonContextProvider context={common}>
      <SessionContextProvider context={session}>
        <Board />
      </SessionContextProvider>
    </CommonContextProvider>
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
      common: getCommonContext(context),
      session,
    },
  };
}
