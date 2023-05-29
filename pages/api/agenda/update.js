import { isAfter } from "date-fns";
import { makeDBConnection } from "prisma/db";
import validateAgendaStartEnd from "utils/validateAgendaStartEnd";

export default async function update(req, res) {
  if (req.method !== "PUT") return res.status(405).send();
  const token = req.headers["x-token"];
  if (!token) return res.status(401).send();
  try {
    const { id, title, description, start, end, labels, statuses, color } =
      req.body;

    if (!validateAgendaStartEnd(start, end))
      throw new Error(
        "Invalid Agenda start and end format, end date should be greater than start date and should no more than 1 year"
      );

    if (
      !(
        statuses.length &&
        statuses.length >= 3 &&
        ["TODO", "INPROGRESS", "COMPLETED"].every((type) =>
          statuses.map((s) => s.type).includes(type)
        )
      )
    )
      throw new Error(
        "Agenda should have at least 3 statuses: todo, inprogress, and completed"
      );

    const data = await makeDBConnection(async (db) => {
      const validToken = await db.token.findUnique({ where: { key: token } });
      if (!validToken) return { error: "invalid token" };
      else if (isAfter(new Date(), new Date(validToken.expiredAt)))
        return { error: "invalid token" };

      const currAgenda = await db.agenda.findUnique({
        where: { id },
        include: { labels: true, statuses: true },
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

      const deletedStatuses = currAgenda.statuses.filter(
        (status) => !statuses.find((s) => s.id === status.id)
      );

      if (deletedStatuses.length) {
        await db.status.deleteMany({
          where: { id: { in: deletedStatuses.map((s) => s.id) } },
        });
      }

      const newStatuses = statuses.filter((s) => !s.id);

      if (newStatuses.length) {
        await db.status.createMany({
          data: newStatuses.map((s) => ({
            ...s,
            agendaId: currAgenda.id,
          })),
        });
      }

      const updatedStatuses = statuses.filter((s) => s.id);

      for (const status of updatedStatuses) {
        const updatedStatus = status;
        const id = updatedStatus.id;
        delete updatedStatus.id;
        await db.status.update({
          where: { id },
          data: updatedStatus,
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
        include: { labels: true, statuses: true },
      });
    });

    if (data.error) throw new Error(data.error);

    res.status(200).json({
      message: "Agenda updated successfully!",
      agenda: data,
    });
  } catch (err) {
    res.status(500).send(err.toString());
  }
}
