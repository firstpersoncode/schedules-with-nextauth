import { getSession } from "next-auth/react";
import { makeDBConnection } from "prisma/db";
import validateEventStartEnd from "utils/validateEventStartEnd";

export default async function update(req, res) {
  if (req.method !== "PUT") res.status(405).send();

  try {
    const session = await getSession({ req });
    if (!session) throw new Error("Session not found");

    const { id, title, description, start, end, labels, statusId } = req.body;

    if (!validateEventStartEnd(start, end))
      throw new Error(
        "Invalid Event date range format, end date should be greater than start date"
      );

    await makeDBConnection(async (db) => {
      await db.event.update({
        where: {
          id,
        },
        data: {
          title,
          description,
          start,
          end,
          labelIds: labels.map((l) => l.id),
          statusId,
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
