import { getSession } from "next-auth/react";
import { makeDBConnection } from "prisma/db";

export default async function del(req, res) {
  if (req.method !== "DELETE") res.status(405).send();

  try {
    const session = await getSession({ req });
    if (!session) throw new Error("Session not found");
    const projectId = req.query.projectId;
    if (!projectId) throw new Error("ID not found");
    await makeDBConnection(async (db) => {
      await db.project.delete({
        where: {
          id: projectId,
        },
      });
    });

    res.status(200).json({
      message: "Project deleted successfully!",
    });
  } catch (err) {
    res.status(500).send(err.toString());
  }
}
