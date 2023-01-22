import { getSession } from "next-auth/react";
import { makeDBConnection } from "prisma/db";

export default async function create(req, res) {
  if (req.method !== "POST") res.status(405).send();

  try {
    const session = await getSession({ req });
    if (!session) throw new Error("Session not found");
    const userId = session.user.id;
    const { title, description, start, end, labels, eventColor } = req.body;

    const data = await makeDBConnection(async (db) => {
      const newAgenda = await db.agenda.create({
        data: {
          title,
          description,
          start,
          end,
          eventColor,
          userIds: [userId],
        },
      });

      if (labels.length) {
        await db.label.createMany({
          data: labels.map((l) => ({
            ...l,
            agendaId: newAgenda.id,
          })),
        });
      }

      const agenda = await db.agenda.findUnique({
        where: { id: newAgenda.id },
        include: { labels: true },
      });

      return agenda;
    });

    res
      .status(200)
      .json({ message: "Agenda created successfully!", agenda: data });
  } catch (err) {
    res.status(500).send(err.toString());
  }
}
