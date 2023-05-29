import { isAfter } from "date-fns";
import { makeDBConnection } from "prisma/db";

export default async function list(req, res) {
  if (req.method !== "GET") return res.status(405).send();
  const token = req.headers["x-token"];
  if (!token) return res.status(401).send();
  try {
    const agendaId = req.query.agendaId;
    const events = await makeDBConnection(async (db) => {
      const validToken = await db.token.findUnique({ where: { key: token } });
      if (!validToken) return { error: "invalid token" };
      else if (isAfter(new Date(), new Date(validToken.expiredAt)))
        return { error: "invalid token" };

      return await db.event.findMany({
        where: {
          agendaId,
        },
        include: {
          labels: true,
          status: true,
        },
      });
    });

    if (events.error) throw new Error(events.error);

    res.status(200).json({ events });
  } catch (err) {
    res.status(500).send(err.toString());
  }
}
