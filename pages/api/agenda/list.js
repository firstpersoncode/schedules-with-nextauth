import { getSession } from "next-auth/react";
import { makeDBConnection } from "prisma/db";

export default async function list(req, res) {
  if (req.method !== "GET") res.status(405).send();

  try {
    const session = await getSession({ req });
    if (!session) throw new Error("Session not found");
    const projectId = req.query.projectId;
    const agendas = await makeDBConnection(async (db) => {
      return await db.agenda.findMany({
        where: {
          projectId,
        },
        // include: {
        //   events: true,
        // },
      });
    });

    res.status(200).json({ agendas });
  } catch (err) {
    res.status(500).send(err.toString());
  }
}
