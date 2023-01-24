import { differenceInMilliseconds, isAfter, isLeapYear } from "date-fns";

export default function validateAgendaStartEnd(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (isAfter(startDate, endDate)) return false;

  let totalDaysInYear = 365;

  if (
    isLeapYear(startDate) ||
    (isLeapYear(endDate) && endDate.getMonth() < 2)
  ) {
    totalDaysInYear = 366;
  }

  const yearInMilliseconds = totalDaysInYear * 24 * 60 * 60 * 1000;

  const diffMilliSeconds = Math.abs(
    differenceInMilliseconds(startDate, endDate)
  );

  if (diffMilliSeconds > yearInMilliseconds) return false;

  return true;
}
