import { getSession } from "next-auth/react";
import { makeDBConnection } from "prisma/db";

export default async function create(req, res) {
  if (req.method !== "POST") res.status(405).send();

  try {
    const session = await getSession({ req });
    if (!session) throw new Error("Session not found");
    const userId = session.user.id;
    const { title, description, labels } = req.body;

    const newProject = await makeDBConnection(async (db) => {
      return await db.project.create({
        data: {
          title,
          description,
          userIds: [userId],
        },
      });
    });

    if (labels.length) {
      await makeDBConnection(async (db) => {
        return await db.label.createMany({
          data: labels.map((l) => ({
            ...l,
            projectId: newProject.id,
          })),
        });
      });
    }

    res.status(200).json({
      message: "Project created successfully!",
      project: { ...newProject, labels },
    });
  } catch (err) {
    res.status(500).send(err.toString());
  }
}
