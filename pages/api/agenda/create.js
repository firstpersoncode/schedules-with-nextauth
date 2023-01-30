import { getSession } from "next-auth/react";
import { makeDBConnection } from "prisma/db";
import validateAgendaStartEnd from "utils/validateAgendaStartEnd";

export default async function create(req, res) {
  if (req.method !== "POST") res.status(405).send();

  try {
    const session = await getSession({ req });
    if (!session) throw new Error("Session not found");
    const userId = session.user.id;
    const { title, description, start, end, labels, statuses, color } =
      req.body;

    if (!validateAgendaStartEnd(start, end))
      throw new Error(
        "Invalid Agenda start and end format, end date should be greater than start date and should no more than 1 year"
      );

    if (
      !(
        statuses.length &&
        statuses.length >= 3 &&
        ["TODO", "INPROGRESS", "COMPLETED"].every((type) =>
          statuses.map((s) => s.type).includes(type)
        )
      )
    )
      throw new Error(
        "Agenda should have at least 3 statuses: todo, inprogress, and completed"
      );

    const data = await makeDBConnection(async (db) => {
      const newAgenda = await db.agenda.create({
        data: {
          title,
          description,
          start,
          end,
          color,
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

      await db.status.createMany({
        data: statuses.map((s) => ({
          ...s,
          agendaId: newAgenda.id,
        })),
      });

      const agenda = await db.agenda.findUnique({
        where: { id: newAgenda.id },
        include: { labels: true, statuses: true },
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
