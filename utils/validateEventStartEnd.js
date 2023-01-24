import { differenceInMilliseconds, isAfter, isBefore } from "date-fns";

export default function validateEventStartEnd(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (isAfter(startDate, endDate)) return false;

  const dayInMilliseconds = 24 * 60 * 60 * 1000;

  const diffMilliSeconds = Math.abs(
    differenceInMilliseconds(startDate, endDate)
  );

  if (diffMilliSeconds > dayInMilliseconds) return false;

  return true;
}

export function validateEventStartEndWithinAgenda(start, end, agenda) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const agendaStartDate = new Date(agenda.start);
  const agendaEndDate = new Date(agenda.end);

  if (isBefore(startDate, agendaStartDate)) return false;
  if (isAfter(startDate, agendaEndDate) || isAfter(endDate, agendaEndDate))
    return false;

  return true;
}
