import { getSession } from "next-auth/react";
import { makeDBConnection } from "prisma/db";

export default async function update(req, res) {
  if (req.method !== "PUT") res.status(405).send();

  try {
    const session = await getSession({ req });
    if (!session) throw new Error("Session not found");

    const { id, title, description, start, end } = req.body;

    await makeDBConnection(async (db) => {
      const currAgenda = await db.agenda.findUnique({
        where: { id },
      });

      if (!currAgenda) throw new Error("Agenda not found");

      await db.agenda.update({
        where: {
          id: currAgenda.id,
        },
        data: {
          title,
          description,
          start,
          end,
        },
      });
    });

    res.status(200).json({
      message: "Agenda updated successfully!",
    });
  } catch (err) {
    res.status(500).send(err.toString());
  }
}
