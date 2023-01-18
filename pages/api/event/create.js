import { getSession } from "next-auth/react";
import { makeDBConnection } from "prisma/db";

export default async function create(req, res) {
  if (req.method !== "POST") res.status(405).send();

  try {
    const session = await getSession({ req });
    if (!session) throw new Error("Session not found");

    const { title, description, start, end, agendaId, labels } = req.body;

    const newEvent = await makeDBConnection(async (db) => {
      return await db.event.create({
        data: {
          title,
          description,
          start,
          end,
          status: "TODO",
          type: "TASK",
          agenda: { connect: { id: agendaId } },
          labelIds: labels.map((l) => l.id),
        },
      });
    });

    res
      .status(200)
      .json({ message: "Event created successfully!", event: newEvent });
  } catch (err) {
    res.status(500).send(err.toString());
  }
}
