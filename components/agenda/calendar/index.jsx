import dynamic from "next/dynamic";
import { Views } from "react-big-calendar";
import { Box } from "@mui/material";
import { useAgendaContext } from "context/agenda";

const DayView = dynamic(() => import("./dayView"));
const WeekView = dynamic(() => import("./weekView"));
const MonthView = dynamic(() => import("./monthView"));
const TableView = dynamic(() => import("./tableView"));

export default function Calendar() {
  const { view } = useAgendaContext();

  return (
    <Box
      sx={{
        height: "100vh",
        overflowY: "auto",
        pt: "40px",
        "& .rbc-timeslot-group": { minHeight: 60 },
        "& .rbc-label": { fontSize: 10 },
        "& .rbc-event-label": { fontSize: 10 },
        "& .rbc-current-time-indicator": {
          backgroundColor: (theme) => theme.palette.primary.main,
        },
      }}
    >
      {view.value === Views.DAY && <DayView />}
      {view.value === Views.WEEK && <WeekView />}
      {view.value === Views.MONTH && <MonthView />}
      {view.value === "table" && <TableView />}
    </Box>
  );
}
