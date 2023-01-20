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
  isSameDay,
} from "date-fns";
import enUS from "date-fns/locale/en-US";
import { useProjectContext } from "context/project";
import { Box, Popover } from "@mui/material";
import { useState } from "react";

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

function CustomDateCellWrapper({ children, ...props }) {
  const {
    selectedDate,
    agenda,
    events,
    selectEvent,
    setIsEditingEvent,
    toggleEventDialog,
    setSelectedCell,
    setSelectedDate,
  } = useProjectContext();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const d = new Date(props.value);

  const backgroundColors = {
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
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    }),
    ...(agenda.end &&
      isAfter(startOfDay(new Date(d)), startOfDay(new Date(agenda.end))) && {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }),
  };

  const handleClick = (e) => {
    e.stopPropagation();

    const min = startOfDay(new Date(agenda.start));
    const day = startOfDay(new Date(d));

    const availableDate = agenda.end
      ? (isSameDay(day, min) || isAfter(day, min)) &&
        isBefore(day, endOfDay(new Date(agenda.end)))
      : isSameDay(day, min) || isAfter(day, min);

    if (availableDate) {
      setSelectedDate(day);
      setAnchorEl(e.currentTarget);
    }
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  const handleSelectEvent = (event) => {
    selectEvent(event);
    setIsEditingEvent(true);
    toggleEventDialog();
  };

  const handleSelectSlot = (cell) => {
    if (!cell?.start) return;
    setSelectedCell(cell);
    setIsEditingEvent(false);
    toggleEventDialog();
  };

  const selectedEvents = events.filter((e) =>
    isSameDay(new Date(e.start), new Date(d))
  );

  return (
    <Box
      onClick={handleClick}
      sx={{
        position: "relative",
        zIndex: 5,
        display: "flex",
        flex: 1,
        borderLeft: "1px solid #DDD",
        ...backgroundColors,
      }}
    >
      {children}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        PaperProps={{ sx: { width: "70vw", height: 400, overflowY: "auto" } }}
      >
        <Calendar
          date={startOfDay(new Date(d))}
          defaultView={Views.DAY}
          events={selectedEvents}
          localizer={localizer}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          toolbar={false}
          scrollToTime={new Date()}
          onNavigate={() => {}}
        />
      </Popover>
    </Box>
  );
}

export default function WeekView() {
  const { events, selectedDate } = useProjectContext();

  return (
    <Calendar
      date={selectedDate}
      view={Views.WEEK}
      events={events}
      localizer={localizer}
      toolbar={false}
      onNavigate={() => {}}
      onView={() => {}}
      style={{ minHeight: 600 }}
      longPressThreshold={1}
      components={{
        dateCellWrapper: CustomDateCellWrapper,
        timeSlotWrapper: CustomDateCellWrapper,
      }}
    />
  );
}
