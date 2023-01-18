import { getSession } from "next-auth/react";
import { makeDBConnection } from "prisma/db";

export default async function create(req, res) {
  if (req.method !== "POST") res.status(405).send();

  try {
    const session = await getSession({ req });
    if (!session) throw new Error("Session not found");

    const { title, description, start, end, projectId } = req.body;

    const newAgenda = await makeDBConnection(async (db) => {
      return await db.agenda.create({
        data: {
          title,
          description,
          start,
          end,
          projectId,
        },
      });
    });

    res
      .status(200)
      .json({ message: "Agenda created successfully!", agenda: newAgenda });
  } catch (err) {
    res.status(500).send(err.toString());
  }
}
