import { makeDBConnection } from "prisma/db";

export default async function get(req, res) {
  if (req.method !== "GET") return res.status(405).send();

  try {
    const agendaId = req.query.agendaId;
    const agenda = await makeDBConnection(async (db) => {
      return await db.agenda.findUnique({
        where: {
          id: agendaId,
        },
      });
    });

    if (!agenda) throw new Error("Agenda not found");

    res.status(200).json({ agenda });
  } catch (err) {
    res.status(500).send(err.toString());
  }
}
