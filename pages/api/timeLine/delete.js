import { getSession } from "next-auth/react";
import { makeDBConnection } from "prisma/db";

export default async function del(req, res) {
  if (req.method !== "DELETE") res.status(405).send();

  try {
    const session = await getSession({ req });
    if (!session) throw new Error("Session not found");
    const timeLineId = req.query.timeLineId;
    if (!timeLineId) throw new Error("ID not found");
    await makeDBConnection(async (db) => {
      await db.timeLine.delete({
        where: {
          id: timeLineId,
        },
      });
    });

    res.status(200).json({
      message: "TimeLine deleted successfully!",
    });
  } catch (err) {
    res.status(500).send(err.toString());
  }
}
