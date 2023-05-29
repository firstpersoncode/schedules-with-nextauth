import { makeDBConnection } from "prisma/db";
import validateEventStartEnd from "utils/validateEventStartEnd";

export default async function update(req, res) {
  if (req.method !== "PUT") return res.status(405).send();
  const token = req.headers["x-token"];
  if (!token) return res.status(401).send();
  try {
    const { id, title, description, start, end, labels, statusId } = req.body;

    if (!validateEventStartEnd(start, end))
      throw new Error(
        "Invalid Event date range format, end date should be greater than start date"
      );

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
          title,
          description,
          start,
          end,
          labelIds: labels.map((l) => l.id),
          statusId,
        },
      });

      return { error: false };
    });

    if (data.error) throw new Error(data.error);

    res.status(200).json({
      message: "Event updated successfully!",
    });
  } catch (err) {
    res.status(500).send(err.toString());
  }
}
