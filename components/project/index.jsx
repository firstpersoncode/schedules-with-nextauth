import { Box, Toolbar } from "@mui/material";
import { useState } from "react";
import { useProjectContext } from "context/project";

import TopBar from "./topbar";
import SideBar from "./sidebar";
import Notifications from "./notifications";
import EventDialog from "./eventDialog";
import ProjectDialog from "./projectDialog";
import AgendaDialog from "./agendaDialog";
import StickyToolbar from "./stickyToolbar";
import AgendaDetail from "./agendaDetail";
import Agenda from "./agenda";

export default function Project() {
  const { ready } = useProjectContext();
  const [openDrawer, setOpenDrawer] = useState(false);

  function handleOpenDrawer() {
    setOpenDrawer(true);
  }

  function handleCloseDrawer() {
    setOpenDrawer(false);
  }

  return (
    <>
      <TopBar
        name="Default"
        open={openDrawer}
        onOpen={handleOpenDrawer}
        onClose={handleCloseDrawer}
      />
      <Box
        sx={{
          display: "flex",
          opacity: ready ? 1 : 0.3,
          pointerEvents: ready ? "auto" : "none",
        }}
      >
        <SideBar
          open={openDrawer}
          onOpen={handleOpenDrawer}
          onClose={handleCloseDrawer}
        />
        <Box
          component="main"
          sx={{ flexGrow: 1, height: "100vh", overflowY: "auto" }}
        >
          <Toolbar />
          <AgendaDetail />
          <Notifications />
          <StickyToolbar />
          <Agenda />
        </Box>
      </Box>

      <ProjectDialog />
      <AgendaDialog />
      <EventDialog />
    </>
  );
}
