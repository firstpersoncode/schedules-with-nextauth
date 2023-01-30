import dynamic from "next/dynamic";
import { SwipeableDrawer, Drawer as MuiDrawer } from "@mui/material";
import { useCommonContext } from "context/common";

const Menu = dynamic(() => import("./menu"));
const drawerWidth = "20vw";

export default function Drawer() {
  const { isMobile, drawer, toggleDrawer } = useCommonContext();

  return (
    <>
      {isMobile ? (
        <>
          <SwipeableDrawer
            anchor="left"
            open={drawer}
            onClose={toggleDrawer}
            onOpen={toggleDrawer}
            sx={{
              width: "80%",
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: "80%",
                boxSizing: "border-box",
                // overflow: "visible",
              },
            }}
          >
            {drawer && <Menu />}
          </SwipeableDrawer>
        </>
      ) : (
        <MuiDrawer
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
        </MuiDrawer>
      )}
    </>
  );
}
