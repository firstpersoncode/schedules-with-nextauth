import dynamic from "next/dynamic";
import { SwipeableDrawer, Box } from "@mui/material";
import { useCommonContext } from "context/common";

const Notifications = dynamic(() => import("./notifications"));

export default function Infobar() {
  const { infoDrawer, toggleInfoDrawer } = useCommonContext();

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
      <Box sx={{ overflowY: "auto" }}>{infoDrawer && <Notifications />}</Box>
    </SwipeableDrawer>
  );
}
