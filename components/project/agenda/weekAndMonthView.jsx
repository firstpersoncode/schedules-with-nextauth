import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { Box, Button, ButtonGroup, IconButton, Tab } from "@mui/material";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  isEqual,
  startOfDay,
  add,
  sub,
  isAfter,
  isBefore,
  endOfDay,
} from "date-fns";
import enUS from "date-fns/locale/en-US";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import Table from "./table";
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

export default function WeekAndMonthView() {
  const {
    agenda,
    events,
    selectedDate,
    view,
    setView,
    setSelectedDate,
    toggleIsTable,
    isTable,
  } = useProjectContext();

  function handleBackDate() {
    const d = sub(new Date(selectedDate), { [`${view}s`]: 1 });
    const min = startOfDay(new Date(agenda.start));
    if (isAfter(d, min)) setSelectedDate(d);
    else setSelectedDate(min);
  }

  function handleNextDate() {
    const d = add(new Date(selectedDate), { [`${view}s`]: 1 });
    if (agenda.end) {
      const max = endOfDay(new Date(agenda.end));
      if (isBefore(d, max)) setSelectedDate(d);
      else setSelectedDate(max);
    } else setSelectedDate(d);
  }

  const onSelectSlot = (cell) => {
    const min = startOfDay(new Date(agenda.start));
    const d = cell.start;
    const availableDate = agenda.end
      ? isAfter(d, min) && isBefore(d, endOfDay(new Date(agenda.end)))
      : isAfter(d, min);

    if (availableDate) setSelectedDate(cell.start);
  };

  const onSelectEvent = (event) => {
    console.log(event);
  };

  const dayPropGetter = (d) => ({
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
    <>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: { xs: "space-between", lg: "flex-end" },
        }}
      >
        <IconButton onClick={handleBackDate}>
          <ChevronLeft />
        </IconButton>
        <ButtonGroup>
          <Button
            variant={view === Views.MONTH ? "contained" : "outlined"}
            onClick={setView(Views.MONTH)}
          >
            Month
          </Button>
          <Button
            variant={view === Views.WEEK ? "contained" : "outlined"}
            onClick={setView(Views.WEEK)}
          >
            Week
          </Button>
          <Button
            variant={isTable ? "contained" : "outlined"}
            onClick={toggleIsTable}
            color="secondary"
          >
            Table
          </Button>
        </ButtonGroup>
        <IconButton onClick={handleNextDate}>
          <ChevronRight />
        </IconButton>
      </Box>

      <Box
        sx={{
          display: !isTable ? "block" : "none",
          height: { xs: view !== Views.MONTH ? "auto" : 500, lg: 500 },
          width: "100%",
          overflowX: "auto",
          "& .rbc-calendar": {
            minWidth: 500,
          },
        }}
      >
        <Calendar
          date={selectedDate}
          view={view}
          events={events}
          localizer={localizer}
          onSelectEvent={onSelectEvent}
          onSelectSlot={onSelectSlot}
          selectable
          toolbar={false}
          dayPropGetter={dayPropGetter}
          eventPropGetter={eventPropGetter}
          longPressThreshold={100}
          onNavigate={() => {}}
          onView={() => {}}
        />
      </Box>
      <Box
        sx={{
          display: isTable ? "block" : "none",
          height: { xs: "auto", lg: 500 },
          overflowY: "auto",
        }}
      >
        <Table />
      </Box>
    </>
  );
}
