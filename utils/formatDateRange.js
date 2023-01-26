import { format, isSameDay, isSameMonth, isSameYear } from "date-fns";

export default function formatDateRange(start, end) {
  if (isSameDay(new Date(start), new Date(end)))
    return `${format(new Date(start), "iii dd MMM HH:mm")} - ${format(
      new Date(end),
      "HH:mm, yyyy"
    )}`;
  let res = "";
  if (isSameMonth(new Date(start), new Date(end)))
    res = `${format(new Date(start), "iii dd")} - ${format(
      new Date(end),
      "iii dd MMM, yyyy"
    )}`;
  else {
    if (isSameYear(new Date(start), new Date(end)))
      res = `${format(new Date(start), "iii dd MMM")} - ${format(
        new Date(end),
        "iii dd MMM, yyyy"
      )}`;
    else
      res = `${format(new Date(start), "iii dd MMM, yyyy")} - ${format(
        new Date(end),
        "iii dd MMM, yyyy"
      )}`;
  }

  return res;
}
