import { isAfter } from "date-fns";
import { makeDBConnection } from "prisma/db";

export default async function list(req, res) {
  if (req.method !== "GET") return res.status(405).send();

  const token = req.headers["x-token"];
  if (!token) return res.status(401).send();

  try {
    const data = await makeDBConnection(async (db) => {
      const validToken = await db.token.findUnique({ where: { key: token } });
      if (!validToken) return { error: "invalid token" };
      else if (isAfter(new Date(), new Date(validToken.expiredAt)))
        return { error: "invalid token" };

      const agendas = await db.agenda.findMany({
        where: { ownerId: validToken.id },
        include: {
          labels: true,
          statuses: true,
        },
      });

      const events = await db.event.findMany({
        where: {
          agendaId: { in: agendas.map((a) => a.id) },
        },
        include: {
          labels: true,
          status: true,
        },
      });

      return { agendas, events };
    });

    if (data.error) throw new Error(data.error);

    res.status(200).json(data);
  } catch (err) {
    res.status(500).send(err.toString());
  }
}
