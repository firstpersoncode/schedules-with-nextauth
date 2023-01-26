import { getSession } from "next-auth/react";
import { makeDBConnection } from "prisma/db";
import validateTimeLineStartEnd, {
  validateTimeLineStartEndWithinAgenda,
} from "utils/validateTimeLineStartEnd";

export default async function update(req, res) {
  if (req.method !== "PUT") res.status(405).send();

  try {
    const session = await getSession({ req });
    if (!session) throw new Error("Session not found");

    const { id, title, description, start, end, type } = req.body;

    if (!validateTimeLineStartEnd(start, end))
      throw new Error(
        "Invalid TimeLine date range format, end date should be greater than start date and should no more than 1 day"
      );

    await makeDBConnection(async (db) => {
      const currTimeLine = await db.timeLine.findUnique({
        where: { id },
        include: {
          agenda: true,
        },
      });

      if (!currTimeLine) throw new Error("TimeLine not found");

      const { agenda } = currTimeLine;

      if (!agenda) throw new Error("Agenda not found");

      if (!validateTimeLineStartEndWithinAgenda(start, end, agenda))
        throw new Error(
          "TimeLine should start and ends within the agenda timeline"
        );

      await db.timeLine.update({
        where: {
          id: currTimeLine.id,
        },
        data: {
          title,
          description,
          start,
          end,
          type,
        },
      });
    });

    res.status(200).json({
      message: "TimeLine updated successfully!",
    });
  } catch (err) {
    res.status(500).send(err.toString());
  }
}
