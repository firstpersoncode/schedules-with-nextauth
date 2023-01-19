import { Box, Card, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import BurnDownChart from "./burndownChart";
import ProgressChart from "./progressChart";

export default function Report() {
  const [tab, setTab] = useState(0);

  const handleChangeTab = (_, v) => {
    setTab(v);
  };

  return (
    <>
      <Card sx={{ zIndex: 10, position: "sticky", top: 0 }}>
        <Tabs value={tab} onChange={handleChangeTab}>
          <Tab label="Progress" />
          <Tab label="Burndown" />
        </Tabs>
      </Card>
      <Box sx={{ display: tab === 0 ? "block" : "none" }}>
        <ProgressChart />
      </Box>
      <Box sx={{ display: tab === 1 ? "block" : "none" }}>
        <BurnDownChart />
      </Box>
    </>
  );
}
