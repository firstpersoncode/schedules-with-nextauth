import { getSession } from "next-auth/react";
import { makeDBConnection } from "prisma/db";
import validateEventStartEnd, {
  validateEventStartEndWithinAgenda,
} from "utils/validateEventStartEnd";

export default async function update(req, res) {
  if (req.method !== "PUT") res.status(405).send();

  try {
    const session = await getSession({ req });
    if (!session) throw new Error("Session not found");

    const { id, title, description, start, end, labels, status, type } =
      req.body;

    if (!validateEventStartEnd(start, end))
      throw new Error(
        "Invalid Event date range format, end date should be greater than start date and should no more than 1 day"
      );

    await makeDBConnection(async (db) => {
      const currEvent = await db.event.findUnique({
        where: { id },
        include: {
          agenda: true,
        },
      });

      if (!currEvent) throw new Error("Event not found");

      const { agenda } = currEvent;

      if (!agenda) throw new Error("Agenda not found");

      if (!validateEventStartEndWithinAgenda(start, end, agenda))
        throw new Error(
          "Event should start and ends within the agenda timeline"
        );

      await db.event.update({
        where: {
          id: currEvent.id,
        },
        data: {
          title,
          description,
          start,
          end,
          labelIds: labels.map((l) => l.id),
          status,
          type,
        },
      });
    });

    res.status(200).json({
      message: "Event updated successfully!",
    });
  } catch (err) {
    res.status(500).send(err.toString());
  }
}
