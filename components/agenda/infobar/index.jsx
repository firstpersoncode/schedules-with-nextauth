import dynamic from "next/dynamic";
import { Close } from "@mui/icons-material";
import { SwipeableDrawer, IconButton, Box } from "@mui/material";
import { useAgendaContext } from "context/agenda";

const Notifications = dynamic(() => import("./notifications"));
const Report = dynamic(() => import("./report"));

export default function InfoBar() {
  const { infoDrawer, toggleInfoDrawer } = useAgendaContext();

  return (
    <SwipeableDrawer
      anchor="right"
      open={infoDrawer}
      onClose={toggleInfoDrawer}
      onOpen={toggleInfoDrawer}
      sx={{
        width: { xs: "80%", lg: "20vw" },
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: { xs: "80%", lg: "20vw" },
          boxSizing: "border-box",
        },
      }}
    >
      <Box>
        <IconButton sx={{ p: 1 }} size="small" onClick={toggleInfoDrawer}>
          <Close />
        </IconButton>
      </Box>
      <Box sx={{ overflowY: "auto" }}>
        {infoDrawer && <Notifications />}
        {infoDrawer && <Report />}
      </Box>
    </SwipeableDrawer>
  );
}
