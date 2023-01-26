import { getSession } from "next-auth/react";
import { makeDBConnection } from "prisma/db";
import validateEventStartEnd, {
  validateEventStartEndWithinAgenda,
} from "utils/validateEventStartEnd";

export default async function create(req, res) {
  if (req.method !== "POST") res.status(405).send();

  try {
    const session = await getSession({ req });
    if (!session) throw new Error("Session not found");

    const { title, description, start, end, agendaId, labels, status } =
      req.body;
    if (!validateEventStartEnd(start, end))
      throw new Error(
        "Invalid Event date range format, end date should be greater than start date and should no more than 1 day"
      );

    const newEvent = await makeDBConnection(async (db) => {
      const agenda = await db.agenda.findUnique({
        where: { id: agendaId },
        select: { start: true, end: true },
      });

      if (!agenda) throw new Error("Agenda not found");

      if (!validateEventStartEndWithinAgenda(start, end, agenda))
        throw new Error(
          "Event should start and ends within the agenda timeline"
        );

      return await db.event.create({
        data: {
          title,
          description,
          start,
          end,
          agenda: { connect: { id: agendaId } },
          labelIds: labels.map((l) => l.id),
          status,
        },
      });
    });

    res
      .status(200)
      .json({ message: "Event created successfully!", event: newEvent.id });
  } catch (err) {
    res.status(500).send(err.toString());
  }
}
