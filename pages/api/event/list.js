import { getSession } from "next-auth/react";
import { makeDBConnection } from "prisma/db";

export default async function list(req, res) {
  if (req.method !== "GET") res.status(405).send();

  try {
    const session = await getSession({ req });
    if (!session) throw new Error("Session not found");
    const agendaId = req.query.agendaId;
    const events = await makeDBConnection(async (db) => {
      return await db.event.findMany({
        where: {
          agendaId,
        },
        select: {
          id: true,
          title: true,
          start: true,
          end: true,
          status: true,
          type: true,
          labels: true,
        },
      });
    });

    res.status(200).json({ events });
  } catch (err) {
    res.status(500).send(err.toString());
  }
}
