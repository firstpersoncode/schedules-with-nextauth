import { useCallback, useMemo } from "react";
import { Typography, Chip, Box } from "@mui/material";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  isSameDay,
  startOfDay,
} from "date-fns";
import enUS from "date-fns/locale/en-US";
import { useAgendaContext } from "context/agenda";

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

function Event({ event }) {
  return (
    <>
      <Box
        sx={{
          position: "absolute",
          left: 0,
          bottom: 0,
        }}
      >
        {event.labels.map((label, i) => (
          <Chip
            size="small"
            key={i}
            label={label.title}
            sx={{
              backgroundColor: label.color,
              cursor: "pointer",
              p: 0,
              py: 0.3,
              height: "auto",
            }}
          />
        ))}
      </Box>
      <Typography sx={{ fontWeight: "bold", lineHeight: 1 }}>
        {event.title}
      </Typography>
    </>
  );
}

export default function DayView({ initialScrollToTime }) {
  const { openEventDialog, date, getEvents, getAgendaByEvent } =
    useAgendaContext();
  const events = getEvents();
  const getAgenda = useCallback((e) => getAgendaByEvent(e), [getAgendaByEvent]);

  const scrollToTime = useMemo(() => {
    if (initialScrollToTime) return initialScrollToTime;
    if (isSameDay(startOfDay(new Date(date)), startOfDay(new Date())))
      return new Date();

    return undefined;
  }, [initialScrollToTime, date]);

  const handleSelectSlot = (cell) => {
    openEventDialog(cell);
  };

  const handleSelectEvent = (event) => {
    openEventDialog({ start: event.start, end: event.end }, event);
  };

  const eventPropGetter = useCallback(
    (event) => ({
      style: {
        background: getAgenda(event).eventColor || "grey",
        borderColor: "grey",
        color: "#000",
        boxShadow: "rgb(0 0 0 / 30%) 1px 1px 0.5px 0.5px",
      },
    }),
    [getAgenda]
  );

  return (
    <Calendar
      date={date}
      view={Views.DAY}
      events={events}
      localizer={localizer}
      onSelectEvent={handleSelectEvent}
      onSelectSlot={handleSelectSlot}
      selectable
      toolbar={false}
      scrollToTime={scrollToTime}
      onNavigate={() => {}}
      onView={() => {}}
      longPressThreshold={100}
      eventPropGetter={eventPropGetter}
      components={{
        event: Event,
      }}
    />
  );
}
