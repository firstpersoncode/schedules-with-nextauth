import { isAfter } from "date-fns";
import { makeDBConnection } from "prisma/db";
import validateEventStartEnd from "utils/validateEventStartEnd";

export default async function create(req, res) {
  if (req.method !== "POST") return res.status(405).send();
  const token = req.headers["x-token"];
  if (!token) return res.status(401).send();

  try {
    const {
      title,
      description,
      start,
      end,
      agendaId,
      labels,
      statusId,
      repeat,
      cancelledAt,
    } = req.body;
    if (!validateEventStartEnd(start, end))
      throw new Error(
        "Invalid Event date range format, end date should be greater than start date"
      );

    const newEvent = await makeDBConnection(async (db) => {
      const validToken = await db.token.findUnique({ where: { key: token } });
      if (!validToken) return { error: "invalid token" };
      else if (isAfter(new Date(), new Date(validToken.expiredAt)))
        return { error: "invalid token" };

      // const agenda = await db.agenda.findUnique({
      //   where: { id: agendaId },
      //   select: { start: true, end: true },
      // });

      // if (!agenda) throw new Error("Agenda not found");

      // if (!validateEventStartEndWithinAgenda(start, end, agenda))
      //   throw new Error(
      //     "Event should start and ends within the agenda timeline"
      //   );

      return await db.event.create({
        data: {
          title,
          description,
          start,
          end,
          agendaId: agendaId,
          labelIds: labels.map((l) => l.id),
          statusId,
          repeat,
          cancelledAt,
        },
      });
    });

    if (newEvent.error) throw new Error(newEvent.error);

    res
      .status(200)
      .json({ message: "Event created successfully!", event: newEvent.id });
  } catch (err) {
    res.status(500).send(err.toString());
  }
}
