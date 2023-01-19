import { getSession } from "next-auth/react";
import { makeDBConnection } from "prisma/db";

export default async function update(req, res) {
  if (req.method !== "PUT") res.status(405).send();

  try {
    const session = await getSession({ req });
    if (!session) throw new Error("Session not found");

    const { id, title, description, labels } = req.body;

    await makeDBConnection(async (db) => {
      const currProject = await db.project.findUnique({
        where: { id },
        include: {
          labels: true,
        },
      });

      if (!currProject) throw new Error("Project not found");

      const deletedLabels = currProject.labels.filter(
        (l) => !labels.find((lb) => lb.id === l.id)
      );

      if (deletedLabels.length) {
        await db.label.deleteMany({
          where: { id: { in: deletedLabels.map((l) => l.id) } },
        });
      }

      const newLabels = labels.filter((l) => !l.id);

      if (newLabels.length) {
        await db.label.createMany({
          data: newLabels.map((l) => ({
            ...l,
            projectId: currProject.id,
          })),
        });
      }

      const updatedLabels = labels.filter((l) => l.id);

      for (const label of updatedLabels) {
        const updatedLabel = label;
        const id = updatedLabel.id;
        delete updatedLabel.id;
        await db.label.update({
          where: { id },
          data: updatedLabel,
        });
      }

      await db.project.update({
        where: {
          id: currProject.id,
        },
        data: {
          title,
          description,
        },
      });
    });

    res.status(200).json({
      message: "Project updated successfully!",
    });
  } catch (err) {
    res.status(500).send(err.toString());
  }
}
