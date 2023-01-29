import { Views } from "react-big-calendar";
import { Box, Button, Card, Divider, Tooltip } from "@mui/material";

import { CalendarViewMonth, ViewDay, ViewWeek } from "@mui/icons-material";
import { useCalendarContext } from "context/calendar";

export default function Viewbar() {
  const { view, selectView } = useCalendarContext();

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
      <Divider />
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
      </Box>
    </Card>
  );
}
