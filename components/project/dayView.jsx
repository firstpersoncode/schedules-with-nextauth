import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
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

export default function DayView({}) {
  const {
    toggleEventDialog,
    selectEvent,
    selectedDate,
    events,
    setSelectedCell,
    setIsEditingEvent,
  } = useProjectContext();

  const handleSelectSlot = (cell) => {
    setSelectedCell(cell);
    setIsEditingEvent(false);
    toggleEventDialog();
  };

  const handleSelectEvent = (event) => {
    selectEvent(event);
    setIsEditingEvent(true);
    toggleEventDialog();
  };

  return (
    <Calendar
      date={selectedDate}
      defaultView={Views.DAY}
      events={events}
      localizer={localizer}
      onSelectEvent={handleSelectEvent}
      onSelectSlot={handleSelectSlot}
      selectable
      toolbar={false}
      onNavigate={() => {}}
    />
  );
}
