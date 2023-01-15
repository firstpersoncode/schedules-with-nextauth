import Schedule from "components/schedule";
import ScheduleContextProvider from "context/schedule";
import SessionContextProvider from "context/session";
import { getSession } from "next-auth/react";

export default function SchedulePage({ session }) {
  return (
    <SessionContextProvider context={session}>
      <ScheduleContextProvider context={{}}>
        <Schedule />
      </ScheduleContextProvider>
    </SessionContextProvider>
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
