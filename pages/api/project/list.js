import { getSession } from "next-auth/react";
import { makeDBConnection } from "prisma/db";

export default async function list(req, res) {
  if (req.method !== "GET") res.status(405).send();

  try {
    const session = await getSession({ req });
    if (!session) throw new Error("Session not found");
    const userId = session.user.id;
    const projects = await makeDBConnection(async (db) => {
      return await db.project.findMany({
        where: {
          userIds: { has: userId },
        },
        select: {
          id: true,
          title: true,
          labels: true,
        },
      });
    });

    res.status(200).json({ projects });
  } catch (err) {
    res.status(500).send(err.toString());
  }
}
