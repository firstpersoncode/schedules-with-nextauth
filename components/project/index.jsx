import {
  Box,
  Divider,
  Toolbar,
  Tabs,
  Tab,
  LinearProgress,
} from "@mui/material";
import { useState } from "react";
import TopBar from "./topbar";
import SideBar from "./sidebar";
import IncomingEvents from "./incomingEvents";
import Report from "./report";
import Agenda from "./agenda";
import AddEvent from "./addEvent";
import ProjectDialog from "./projectDialog";
import AddAgenda from "./addAgenda";
import { useProjectContext } from "context/project";

export default function Project() {
  const { agenda, loadingEvent } = useProjectContext();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  function handleOpenDrawer() {
    setOpenDrawer(true);
  }

  function handleCloseDrawer() {
    setOpenDrawer(false);
  }

  function handleSetActiveTab(e, v) {
    setActiveTab(v);
  }

  return (
    <>
      <TopBar
        name="Default"
        open={openDrawer}
        onOpen={handleOpenDrawer}
        onClose={handleCloseDrawer}
      />
      <Box sx={{ display: "flex" }}>
        <SideBar
          open={openDrawer}
          onOpen={handleOpenDrawer}
          onClose={handleCloseDrawer}
          projects={["Exercise", "Schedule Development", "Jobs", "Drafts"]}
        />
        <Box component="main" sx={{ flexGrow: 1, overflowX: "hidden", p: 3 }}>
          <Toolbar />

          {agenda?.id && (
            <>
              {loadingEvent && <LinearProgress />}

              <Box sx={{ opacity: loadingEvent ? "0.3" : "1" }}>
                <IncomingEvents />

                <Tabs
                  variant="fullWidth"
                  value={activeTab}
                  onChange={handleSetActiveTab}
                >
                  <Tab label="Agenda" />
                  <Tab label="Report" />
                </Tabs>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: activeTab === 0 ? "block" : "none" }}>
                  <Agenda />
                </Box>

                <Box sx={{ display: activeTab === 1 ? "block" : "none" }}>
                  <Report />
                </Box>
              </Box>

              <AddEvent />
            </>
          )}
        </Box>
      </Box>

      <ProjectDialog />
      <AddAgenda />
    </>
  );
}
