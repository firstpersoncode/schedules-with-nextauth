import {
  add,
  areIntervalsOverlapping,
  differenceInMilliseconds,
  getDaysInMonth,
  isAfter,
  isBefore,
} from "date-fns";

export default function validateTimeLineStartEnd(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (isAfter(startDate, endDate)) return false;
  let fourMonthsInMilliseconds = 0;

  for (let i = 0; i < 4; i++) {
    const daysInMonth = getDaysInMonth(add(startDate, { days: i }));
    fourMonthsInMilliseconds += daysInMonth * 24 * 60 * 60 * 1000;
  }

  const diffMilliSeconds = Math.abs(
    differenceInMilliseconds(startDate, endDate)
  );

  if (diffMilliSeconds > fourMonthsInMilliseconds) return false;

  return true;
}

export function validateTimeLineStartEndWithinAgenda(start, end, agenda) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const agendaStartDate = new Date(agenda.start);
  const agendaEndDate = new Date(agenda.end);

  if (isBefore(startDate, agendaStartDate)) return false;
  if (isAfter(startDate, agendaEndDate) || isAfter(endDate, agendaEndDate))
    return false;

  return true;
}

export function validateTimeLineStartEndOverlapping(start, end, timeLines) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  let isOverlap = false;

  for (const timeLine of timeLines) {
    isOverlap = areIntervalsOverlapping(
      { start: startDate, end: endDate },
      { start: new Date(timeLine.start), end: new Date(timeLine.end) }
    );

    if (isOverlap) break;
  }

  return !isOverlap;
}
