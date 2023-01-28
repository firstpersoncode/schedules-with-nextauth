import { Views } from "react-big-calendar";
import { Box, Button, Card, Tooltip } from "@mui/material";

import {
  CalendarViewMonth,
  Info,
  ViewDay,
  ViewWeek,
} from "@mui/icons-material";
import { useAgendaContext } from "context/agenda";

export default function Viewbar() {
  const { view, selectView } = useAgendaContext();

  function handleSelectView(selectedView) {
    return function () {
      selectView(selectedView);
    };
  }

  return (
    <Card
      sx={{
        backgroundColor: "#FFF",
        zIndex: 10,
        position: "fixed",
        width: { xs: "100vw", lg: "80vw" },
        bottom: 0,
        right: 0,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Tooltip title="Day view">
          <Button
            sx={{ borderRadius: 0 }}
            fullWidth
            size="small"
            variant={view.value === Views.DAY ? "contained" : undefined}
            onClick={handleSelectView(Views.DAY)}
          >
            <ViewDay />
          </Button>
        </Tooltip>
        <Tooltip title="Week view">
          <Button
            sx={{ borderRadius: 0 }}
            fullWidth
            size="small"
            variant={view.value === Views.WEEK ? "contained" : undefined}
            onClick={handleSelectView(Views.WEEK)}
          >
            <ViewWeek />
          </Button>
        </Tooltip>
        <Tooltip title="Month view">
          <Button
            sx={{ borderRadius: 0 }}
            fullWidth
            size="small"
            variant={view.value === Views.MONTH ? "contained" : undefined}
            onClick={handleSelectView(Views.MONTH)}
          >
            <CalendarViewMonth />
          </Button>
        </Tooltip>
        <Tooltip title="Report">
          <Button
            sx={{ borderRadius: 0 }}
            fullWidth
            size="small"
            variant={view.value === "report" ? "contained" : undefined}
            onClick={handleSelectView("report")}
          >
            <Info />
          </Button>
        </Tooltip>
      </Box>
    </Card>
  );
}
