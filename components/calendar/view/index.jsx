import dynamic from "next/dynamic";
import { Views } from "react-big-calendar";
import { Box } from "@mui/material";
import { useCommonContext } from "context/common";
import { useCalendarContext } from "context/calendar";

const DayView = dynamic(() => import("./dayView"));
const WeekView = dynamic(() => import("./weekView"));
const MonthView = dynamic(() => import("./monthView"));

export default function View() {
  const { isMobile } = useCommonContext();
  const { view } = useCalendarContext();

  return (
    <Box
      sx={{
        "& .rbc-timeslot-group": { minHeight: 60 },
        "& .rbc-label": { fontSize: 10 },
        "& .rbc-event-label": { fontSize: 10 },
        "& .rbc-current-time-indicator": {
          backgroundColor: (theme) => theme.palette.primary.main,
        },
        "& .monthView .rbc-row-content, & .weekView .rbc-row-content": {
          pointerEvents: "none",
        },
      }}
    >
      {isMobile ? (
        <Box
          className={`${view.value}View`}
          sx={{
            flex: 1,
            pt: "40px",
            height: "calc(100vh - 35px)",
            overflow: "hidden",
          }}
        >
          {view.value === Views.DAY && <DayView />}
          {view.value === Views.WEEK && <WeekView />}
          {view.value === Views.MONTH && <MonthView />}
        </Box>
      ) : (
        <Box
          sx={{
            flex: 1,
            pt: "40px",
            display: "flex",
            height: "calc(100vh - 35px)",
            overflow: "hidden",
          }}
        >
          {view.value !== "report" && (
            <Box
              className="dayView"
              sx={{
                flex: 1,
                minWidth: "30%",
              }}
            >
              <DayView />
            </Box>
          )}
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
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
