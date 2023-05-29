import { isAfter } from "date-fns";
import { makeDBConnection } from "prisma/db";

export default async function cancel(req, res) {
  if (req.method !== "PUT") return res.status(405).send();
  const token = req.headers["x-token"];
  if (!token) return res.status(401).send();

  try {
    const { id, cancelledAt } = req.body;

    const data = await makeDBConnection(async (db) => {
      const validToken = await db.token.findUnique({ where: { key: token } });
      if (!validToken) return { error: "invalid token" };
      else if (isAfter(new Date(), new Date(validToken.expiredAt)))
        return { error: "invalid token" };

      await db.event.update({
        where: {
          id,
        },
        data: {
          cancelledAt,
        },
      });

      return { error: false };
    });

    if (data.error) throw new Error(data.error);

    res.status(200).json({
      message: "Event cancelled successfully!",
    });
  } catch (err) {
    res.status(500).send(err.toString());
  }
}
