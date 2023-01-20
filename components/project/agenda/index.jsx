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
          display: !isTable && view.value === Views.DAY ? "block" : "none",
          height: "100vh",
          overflowY: "auto",
          pt: "80px",
        }}
      >
        <DayView />
      </Box>

      <Box
        sx={{
          display: !isTable && view.value === Views.WEEK ? "block" : "none",
          height: "100vh",
          overflowY: "auto",
          pt: "80px",
        }}
      >
        <WeekView />
      </Box>

      <Box
        sx={{
          display: !isTable && view.value === Views.MONTH ? "block" : "none",
          height: "100vh",
          overflowY: "auto",
          pt: "80px",
        }}
      >
        <MonthView />
      </Box>

      <Box
        sx={{
          display: isTable ? "block" : "none",
          height: "100vh",
          overflowY: "auto",
          pt: "80px",
        }}
      >
        <TableView />
      </Box>
    </>
  );
}
