import { getSession } from "next-auth/react";
import { makeDBConnection } from "prisma/db";
import validateTimeLineStartEnd, {
  validateTimeLineStartEndWithinAgenda,
} from "utils/validateTimeLineStartEnd";

export default async function create(req, res) {
  if (req.method !== "POST") res.status(405).send();

  try {
    const session = await getSession({ req });
    if (!session) throw new Error("Session not found");

    const { title, description, start, end, agendaId, type } = req.body;
    if (!validateTimeLineStartEnd(start, end))
      throw new Error(
        "Invalid TimeLine date range format, end date should be greater than start date and should no more than 1 day"
      );

    const newTimeLine = await makeDBConnection(async (db) => {
      const agenda = await db.agenda.findUnique({
        where: { id: agendaId },
        select: { start: true, end: true },
      });

      if (!agenda) throw new Error("Agenda not found");

      if (!validateTimeLineStartEndWithinAgenda(start, end, agenda))
        throw new Error(
          "TimeLine should start and ends within the agenda timeline"
        );

      return await db.timeLine.create({
        data: {
          title,
          description,
          start,
          end,
          type,
          agendaId,
        },
      });
    });

    res.status(200).json({
      message: "TimeLine created successfully!",
      timeLine: newTimeLine.id,
    });
  } catch (err) {
    res.status(500).send(err.toString());
  }
}
