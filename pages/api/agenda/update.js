import { getSession } from "next-auth/react";
import { makeDBConnection } from "prisma/db";
import validateAgendaStartEnd from "utils/validateAgendaStartEnd";

export default async function update(req, res) {
  if (req.method !== "PUT") res.status(405).send();

  try {
    const session = await getSession({ req });
    if (!session) throw new Error("Session not found");

    const { id, title, description, start, end, labels, color } = req.body;

    if (!validateAgendaStartEnd(start, end))
      throw new Error(
        "Invalid Agenda start and end format, end date should be greater than start date and should no more than 1 year"
      );

    const data = await makeDBConnection(async (db) => {
      const currAgenda = await db.agenda.findUnique({
        where: { id },
        include: { labels: true },
      });

      if (!currAgenda) throw new Error("Agenda not found");

      const deletedLabels = currAgenda.labels.filter(
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
            agendaId: currAgenda.id,
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

      await db.agenda.update({
        where: {
          id: currAgenda.id,
        },
        data: {
          title,
          description,
          start,
          end,
          color,
        },
      });

      return await db.agenda.findUnique({
        where: { id: currAgenda.id },
        include: { labels: true },
      });
    });

    res.status(200).json({
      message: "Agenda updated successfully!",
      agenda: data,
    });
  } catch (err) {
    res.status(500).send(err.toString());
  }
}
