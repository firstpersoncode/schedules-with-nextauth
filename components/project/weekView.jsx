import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  isEqual,
  startOfDay,
  isAfter,
  isBefore,
  endOfDay,
} from "date-fns";
import enUS from "date-fns/locale/en-US";
import { useProjectContext } from "context/project";
import { Box } from "@mui/material";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function WeekView() {
  const {
    agenda,
    events,
    selectedDate,
    setSelectedDate,
    selectEvent,
    setSelectedCell,
    setIsEditingEvent,
    toggleEventDialog,
  } = useProjectContext();

  const handleSelectSlot = (cell) => {
    const min = startOfDay(new Date(agenda.start));
    const d = cell.start;
    const availableDate = agenda.end
      ? isAfter(d, min) && isBefore(d, endOfDay(new Date(agenda.end)))
      : isAfter(d, min);

    if (availableDate) {
      setSelectedDate(cell.start);
      setSelectedCell(cell);
      setIsEditingEvent(false);
      toggleEventDialog();
    }
  };

  const handleSelectEvent = (event) => {
    selectEvent(event);
    setIsEditingEvent(true);
    toggleEventDialog();
  };

  const dayPropGetter = (d) => ({
    onClick: () => console.log("AAA"),
    style: {
      backgroundColor: "transparent",

      ...(isEqual(startOfDay(new Date(d)), startOfDay(new Date())) && {
        backgroundColor: "rgba(0, 213, 255, 0.1)",
      }),

      ...(isEqual(
        startOfDay(new Date(d)),
        startOfDay(new Date(selectedDate))
      ) && {
        backgroundColor: "rgba(255, 238, 0, 0.1)",
      }),

      ...(isBefore(
        startOfDay(new Date(d)),
        startOfDay(new Date(agenda.start))
      ) && {
        backgroundColor: "rgba(0, 0, 0, 0.1)",
      }),

      ...(agenda.end &&
        isAfter(startOfDay(new Date(d)), startOfDay(new Date(agenda.end))) && {
          backgroundColor: "rgba(0, 0, 0, 0.1)",
        }),
    },
  });

  const eventPropGetter = (d) => ({
    style: {
      cursor: "pointer",
      zIndex: "5",
    },
  });

  return (
    <Box sx={{ width: "100%", overflowX: "auto" }}>
      <Calendar
        date={selectedDate}
        view={Views.WEEK}
        events={events}
        localizer={localizer}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        selectable
        toolbar={false}
        dayPropGetter={dayPropGetter}
        eventPropGetter={eventPropGetter}
        longPressThreshold={100}
        onNavigate={() => {}}
        onView={() => {}}
        style={{ minWidth: 600 }}
      />
    </Box>
  );
}
