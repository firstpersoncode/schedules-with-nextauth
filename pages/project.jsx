import Meta from "components/meta";
import Project from "components/project";
import ProjectContextProvider from "context/project";
import SessionContextProvider from "context/session";
import { getSession } from "next-auth/react";

export default function ProjectPage({ session }) {
  return (
    <>
      <Meta title="Project" index={false} />
      <SessionContextProvider context={session}>
        <ProjectContextProvider>
          <Project />
        </ProjectContextProvider>
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
