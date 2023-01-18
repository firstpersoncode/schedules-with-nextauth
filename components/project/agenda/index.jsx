import { Box, Grid, Typography, Tabs, Tab, Divider } from "@mui/material";
import { useProjectContext } from "context/project";
import { format } from "date-fns";
import { memo, useState } from "react";
import DayView from "./dayView";
import WeekAndMonthView from "./weekAndMonthView";

export default memo(function Agenda() {
  const { selectedDate } = useProjectContext();
  const [activeTab, setActiveTab] = useState(0);
  function handleSetActiveTab(e, v) {
    setActiveTab(v);
  }

  return (
    <Box>
      <Typography sx={{ textAlign: "center" }}>
        {format(new Date(selectedDate), "dd MMM, yyyy")}
      </Typography>

      <Box sx={{ display: { xs: "none", lg: "block" } }}>
        <Grid container>
          <Grid item xs={12} lg={4}>
            <DayView />
          </Grid>

          <Grid item xs={12} lg={8}>
            <WeekAndMonthView />
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ display: { xs: "block", lg: "none" } }}>
        <Tabs
          variant="fullWidth"
          value={activeTab}
          onChange={handleSetActiveTab}
        >
          <Tab label="Schedule" />
          <Tab label="Calendar" />
        </Tabs>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: activeTab === 0 ? "block" : "none" }}>
          <DayView />
        </Box>

        <Box sx={{ display: activeTab === 1 ? "block" : "none" }}>
          <WeekAndMonthView />
        </Box>
      </Box>
    </Box>
  );
});
