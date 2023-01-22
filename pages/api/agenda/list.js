import { getSession } from "next-auth/react";
import { makeDBConnection } from "prisma/db";

export default async function list(req, res) {
  if (req.method !== "GET") res.status(405).send();

  try {
    const session = await getSession({ req });
    if (!session) throw new Error("Session not found");
    const userId = session.user.id;
    const data = await makeDBConnection(async (db) => {
      const agendas = await db.agenda.findMany({
        where: {
          userIds: { has: userId },
        },
        include: {
          labels: true,
        },
      });

      const events = await db.event.findMany({
        where: {
          agendaId: { in: agendas.map((a) => a.id) },
        },
        include: {
          labels: true,
        },
      });

      return { agendas, events };
    });

    res.status(200).json(data);
  } catch (err) {
    res.status(500).send(err.toString());
  }
}
