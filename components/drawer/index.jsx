import dynamic from "next/dynamic";
import {
  SwipeableDrawer,
  Drawer as MuiDrawer,
  Card,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
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
              height: "100vh",
              "& .MuiDrawer-paper": {
                width: "80%",
                boxSizing: "border-box",
                height: "100%",
              },
            }}
          >
            <Card
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                overflow: "visible",
                minHeight: 40,
              }}
            >
              <IconButton size="small" onClick={toggleDrawer}>
                <Close />
              </IconButton>
            </Card>
            {drawer && <Menu />}
          </SwipeableDrawer>
        </>
      ) : (
        <MuiDrawer
          sx={{
            width: drawerWidth,
            height: "100vh",
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              height: "100%",
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Card
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              overflow: "visible",
              minHeight: 40,
            }}
          >
            {/* <IconButton size="small" onClick={toggleDrawer}>
              <Close />
            </IconButton> */}
          </Card>
          <Menu />
        </MuiDrawer>
      )}
    </>
  );
}
