import { Box } from "@mui/material";
import { useState } from "react";
import { useProjectContext } from "context/project";

import TopBar from "./topbar";
import SideBar from "./sidebar";
import EventDialog from "./eventDialog";
import ProjectDialog from "./projectDialog";
import AgendaDialog from "./agendaDialog";
import Agenda from "./agenda";

export default function Project() {
  const { ready, agenda } = useProjectContext();
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
          sx={{
            flexGrow: 1,
            height: "100vh",
            overflow: "hidden",
          }}
        >
          {agenda?.id && <Agenda />}
        </Box>
      </Box>

      <ProjectDialog />
      <AgendaDialog />
      <EventDialog />
    </>
  );
}
