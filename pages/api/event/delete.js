import { isAfter } from "date-fns";
import { makeDBConnection } from "prisma/db";

export default async function del(req, res) {
  if (req.method !== "DELETE") return res.status(405).send();
  const token = req.headers["x-token"];
  if (!token) return res.status(401).send();
  try {
    const eventId = req.query.eventId;
    if (!eventId) throw new Error("ID not found");
    const data = await makeDBConnection(async (db) => {
      const validToken = await db.token.findUnique({ where: { key: token } });
      if (!validToken) return { error: "invalid token" };
      else if (isAfter(new Date(), new Date(validToken.expiredAt)))
        return { error: "invalid token" };

      await db.event.delete({
        where: {
          id: eventId,
        },
      });

      return { error: false };
    });

    if (data.error) throw new Error(data.error);

    res.status(200).json({
      message: "Event deleted successfully!",
    });
  } catch (err) {
    res.status(500).send(err.toString());
  }
}
