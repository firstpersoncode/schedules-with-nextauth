import dynamic from "next/dynamic";
import { Views } from "react-big-calendar";
import { Box } from "@mui/material";
import { useAgendaContext } from "context/agenda";
import { useGlobalContext } from "context/global";

const DayView = dynamic(() => import("./dayView"));
const WeekView = dynamic(() => import("./weekView"));
const MonthView = dynamic(() => import("./monthView"));
const TableView = dynamic(() => import("./tableView"));

export default function Calendar() {
  const { isMobile } = useGlobalContext();
  const { view } = useAgendaContext();

  return (
    <Box
      sx={{
        display: "flex",
        pt: "40px",
        "& .rbc-timeslot-group": { minHeight: 60 },
        "& .rbc-label": { fontSize: 10 },
        "& .rbc-event-label": { fontSize: 10 },
        "& .rbc-current-time-indicator": {
          backgroundColor: (theme) => theme.palette.primary.main,
        },
      }}
    >
      {isMobile ? (
        <Box
          className={`${view.value}View`}
          sx={{
            flex: 1,
            height: "calc(100vh - 75px)",
            overflow: "hidden",
          }}
        >
          {view.value === Views.DAY && <DayView />}
          {view.value === Views.WEEK && <WeekView />}
          {view.value === Views.MONTH && <MonthView />}
          {view.value === "table" && <TableView />}
        </Box>
      ) : (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            height: "calc(100vh - 75px)",
            overflow: "hidden",
          }}
        >
          <Box
            className="dayView"
            sx={{
              flex: 1,
              minWidth: "30%",
            }}
          >
            <DayView />
          </Box>
          {view.value !== Views.DAY && (
            <Box
              className={`${view.value}View`}
              sx={{
                flex: 1,
                minWidth: "70%",
              }}
            >
              {view.value === Views.WEEK && <WeekView />}
              {view.value === Views.MONTH && <MonthView />}
              {view.value === "table" && <TableView />}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
