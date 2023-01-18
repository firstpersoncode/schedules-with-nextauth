import { useCallback } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { Box, IconButton, Button, ButtonGroup } from "@mui/material";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  add,
  sub,
  isAfter,
  isBefore,
} from "date-fns";
import enUS from "date-fns/locale/en-US";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useProjectContext } from "context/project";

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

export default function WeekAndMonthView({}) {
  const { selectedDate, events, setSelectedDate, setSelectedCell } =
    useProjectContext();

  function handleBackDay() {
    const min = sub(new Date(), { months: 1 });
    const d = sub(new Date(selectedDate), { days: 1 });
    if (isAfter(d, min)) setSelectedDate(d);
  }

  function handleNextDay() {
    const max = add(new Date(), { months: 1 });
    const d = add(new Date(selectedDate), { days: 1 });
    if (isBefore(d, max)) setSelectedDate(d);
  }

  function handleSetToday() {
    setSelectedDate(new Date());
  }

  const handleSelectSlot = (cell) => {
    setSelectedCell(cell);
  };

  const handleSelectEvent = useCallback(
    (event) => window.alert(event.title),
    []
  );

  return (
    <>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: { xs: "space-between", lg: "flex-start" },
        }}
      >
        <IconButton onClick={handleBackDay}>
          <ChevronLeft />
        </IconButton>
        <ButtonGroup>
          <Button onClick={handleSetToday} variant="contained">
            Today
          </Button>
        </ButtonGroup>
        <IconButton onClick={handleNextDay}>
          <ChevronRight />
        </IconButton>
      </Box>

      <Box sx={{ height: { xs: "auto", lg: 500 }, mb: { xs: 2, lg: 0 } }}>
        <Calendar
          date={selectedDate}
          view={Views.DAY}
          events={events}
          localizer={localizer}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          toolbar={false}
          onNavigate={() => {}}
          onView={() => {}}
        />
      </Box>
    </>
  );
}
