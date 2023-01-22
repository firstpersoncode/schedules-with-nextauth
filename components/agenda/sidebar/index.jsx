import { Close } from "@mui/icons-material";
import { SwipeableDrawer, Drawer, IconButton, Box } from "@mui/material";
import { useAgendaContext } from "context/agenda";
import Menu from "./menu";

const drawerWidth = "20vw";

export default function SideBar() {
  const { drawer, toggleDrawer } = useAgendaContext();

  return (
    <>
      <SwipeableDrawer
        anchor="left"
        open={drawer}
        onClose={toggleDrawer}
        onOpen={toggleDrawer}
        sx={{
          display: { xs: "block", lg: "none" },
          width: "90%",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: "90%",
            boxSizing: "border-box",
          },
        }}
      >
        <Box sx={{ textAlign: "right" }}>
          <IconButton sx={{ p: 1 }} size="small" onClick={toggleDrawer}>
            <Close />
          </IconButton>
        </Box>
        <Menu />
      </SwipeableDrawer>

      <Drawer
        sx={{
          display: { xs: "none", lg: "block" },
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Menu />
      </Drawer>
    </>
  );
}
