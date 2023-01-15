export default function getDayName(targetDate) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const d = new Date(targetDate);
  const dayName = days[d.getDay()];
  return dayName;
}
