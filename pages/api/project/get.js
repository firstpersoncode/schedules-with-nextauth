import { getSession } from "next-auth/react";
import { makeDBConnection } from "prisma/db";

export default async function get(req, res) {
  if (req.method !== "GET") res.status(405).send();

  try {
    const session = await getSession({ req });
    if (!session) throw new Error("Session not found");
    const projectId = req.query.projectId;
    const project = await makeDBConnection(async (db) => {
      return await db.project.findUnique({
        where: {
          id: projectId,
        },
        include: {
          labels: true,
        },
      });
    });

    if (!project) throw new Error("Project not found");

    res.status(200).json({ project });
  } catch (err) {
    res.status(500).send(err.toString());
  }
}
