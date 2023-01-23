import { useCallback } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { Box, Typography } from "@mui/material";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import { useAgendaContext } from "context/agenda";
import DateCellWrapper from "./dateCellWrapper";

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
      <Typography sx={{ fontSize: 12, lineHeight: 1 }}>
        {event.title}
      </Typography>
      <Box
        sx={{
          position: "absolute",
          left: 0,
          bottom: 0,
          display: "flex",
        }}
      >
        {event.labels.map((label, i) => (
          <Box
            key={i}
            sx={{ backgroundColor: label.color, cursor: "pointer", p: 0.8 }}
          />
        ))}
      </Box>
    </>
  );
}

export default function WeekView({}) {
  const { date, getEvents, getAgendaByEvent } = useAgendaContext();
  const events = getEvents();
  const getAgenda = useCallback((e) => getAgendaByEvent(e), [getAgendaByEvent]);

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
      view={Views.WEEK}
      events={events}
      localizer={localizer}
      toolbar={false}
      onNavigate={() => {}}
      onView={() => {}}
      eventPropGetter={eventPropGetter}
      components={{
        event: Event,
        dateCellWrapper: DateCellWrapper,
        timeSlotWrapper: DateCellWrapper,
      }}
    />
  );
}
