import { Box } from "@mui/material";
import { useProjectContext } from "context/project";
import { Views } from "react-big-calendar";
import DayView from "./dayView";
import WeekView from "./weekView";
import MonthView from "./monthView";
import TableView from "./tableView";
import Toolbar from "./toolbar";

export default function Agenda() {
  const { view, isTable } = useProjectContext();

  return (
    <>
      <Toolbar />

      <Box
        sx={{
          height: "100vh",
          overflowY: "auto",
          pt: "80px",
        }}
      >
        <Box
          sx={{
            display: !isTable && view.value === Views.DAY ? "block" : "none",
          }}
        >
          <DayView />
        </Box>

        <Box
          sx={{
            display: !isTable && view.value === Views.WEEK ? "block" : "none",
          }}
        >
          <WeekView />
        </Box>

        <Box
          sx={{
            display: !isTable && view.value === Views.MONTH ? "block" : "none",
          }}
        >
          <MonthView />
        </Box>

        <Box
          sx={{
            display: isTable ? "block" : "none",
          }}
        >
          <TableView />
        </Box>
      </Box>
    </>
  );
}
