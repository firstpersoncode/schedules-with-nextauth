import { getSession } from "next-auth/react";
import CommonContextProvider, { getCommonContext } from "context/common";
import SessionContextProvider from "context/session";
import Report from "components/report";

export default function ReportPage({ common, session }) {
  return (
    <CommonContextProvider context={common}>
      <SessionContextProvider context={session}>
        <Report />
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
