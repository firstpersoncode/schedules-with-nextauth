import dynamic from "next/dynamic";
import { Close } from "@mui/icons-material";
import { SwipeableDrawer, Drawer, IconButton, Box } from "@mui/material";
import { useAgendaContext } from "context/agenda";
import useIsMobile from "hooks/useIsMobile";
import { useEffect } from "react";

const Menu = dynamic(() => import("./menu"));
const drawerWidth = "20vw";

export default function SideBar() {
  const { drawer, toggleDrawer } = useAgendaContext();
  const isMobile = useIsMobile();

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
