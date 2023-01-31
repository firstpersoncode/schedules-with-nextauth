import { add, differenceInMinutes, isAfter, isBefore, sub } from "date-fns";

export default function updateEventScheduleByStatus(event, status) {
  const now = new Date();
  if (!event?.id) return { start: now, end: add(now, { minutes: 30 }) };

  const eventStart = new Date(event.start);
  const eventEnd = new Date(event.end);
  const res = { start: eventStart, end: eventEnd };

  if (event.status?.type === status.type) {
    return res;
  }

  if (status.type === "COMPLETED") {
    if (isAfter(res.start, now)) {
      const durationInMinutes = differenceInMinutes(res.end, res.start);
      res.start = sub(now, { minutes: durationInMinutes });
      res.end = now;
    } else {
      const durationInMinutes = differenceInMinutes(now, res.start);
      res.end = add(res.start, { minutes: durationInMinutes });
    }
  } else {
    if (isBefore(res.end, now)) {
      const durationInMinutes = differenceInMinutes(res.end, res.start);
      res.start = now;
      res.end = add(now, { minutes: durationInMinutes });
    } else {
      res.start = now;
    }
  }

  return res;
}
