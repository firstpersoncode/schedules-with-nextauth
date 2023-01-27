import { getSession } from "next-auth/react";
import { makeDBConnection } from "prisma/db";

export default async function cancel(req, res) {
  if (req.method !== "PUT") res.status(405).send();

  try {
    const session = await getSession({ req });
    if (!session) throw new Error("Session not found");

    const { id, cancelledAt } = req.body;

    await makeDBConnection(async (db) => {
      await db.event.update({
        where: {
          id,
        },
        data: {
          cancelledAt,
        },
      });
    });

    res.status(200).json({
      message: "Event cancelled successfully!",
    });
  } catch (err) {
    res.status(500).send(err.toString());
  }
}
