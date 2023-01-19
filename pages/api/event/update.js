import { getSession } from "next-auth/react";
import { makeDBConnection } from "prisma/db";

export default async function update(req, res) {
  if (req.method !== "PUT") res.status(405).send();

  try {
    const session = await getSession({ req });
    if (!session) throw new Error("Session not found");

    const { id, title, description, start, end, labels, status, type } =
      req.body;

    await makeDBConnection(async (db) => {
      const currEvent = await db.event.findUnique({
        where: { id },
      });

      if (!currEvent) throw new Error("Event not found");

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
