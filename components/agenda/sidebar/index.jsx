import dynamic from "next/dynamic";
import { Close } from "@mui/icons-material";
import { SwipeableDrawer, Drawer, IconButton, Box } from "@mui/material";
import { useGlobalContext } from "context/global";
import { useAgendaContext } from "context/agenda";

const Menu = dynamic(() => import("./menu"));
const drawerWidth = "20vw";

export default function SideBar() {
  const { isMobile } = useGlobalContext();
  const { drawer, toggleDrawer } = useAgendaContext();

  return (
    <>
      {isMobile ? (
        <SwipeableDrawer
          anchor="left"
          open={drawer}
          onClose={toggleDrawer}
          onOpen={toggleDrawer}
          sx={{
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
          {drawer && <Menu />}
        </SwipeableDrawer>
      ) : (
        <Drawer
          sx={{
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
      )}
    </>
  );
}
