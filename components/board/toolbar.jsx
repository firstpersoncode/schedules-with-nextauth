import { Box, IconButton, Card, LinearProgress, Tooltip } from "@mui/material";

import { Info, Menu } from "@mui/icons-material";
import { useCommonContext } from "context/common";

export default function Toolbar() {
  const { isLoading, toggleDrawer, toggleInfoDrawer } = useCommonContext();

  return (
    <Card
      sx={{
        backgroundColor: "#FFF",
        zIndex: 10,
        position: "fixed",
        width: { xs: "100vw", lg: "80vw" },
        top: 0,
        right: 0,
        height: 40,
      }}
    >
      <Box
        sx={{
          px: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <IconButton
          size="small"
          sx={{ display: { xs: "block", lg: "none" }, lineHeight: 0 }}
          onClick={toggleDrawer}
        >
          <Menu />
        </IconButton>
        <Box sx={{ flex: 1 }} />
        <Tooltip placement="left" title="Info">
          <IconButton onClick={toggleInfoDrawer}>
            <Info />
          </IconButton>
        </Tooltip>
      </Box>
      {isLoading && <LinearProgress />}
    </Card>
  );
}
