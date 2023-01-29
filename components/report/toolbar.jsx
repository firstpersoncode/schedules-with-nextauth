import { Box, IconButton, Card, LinearProgress } from "@mui/material";

import { Menu } from "@mui/icons-material";
import { useCommonContext } from "context/common";

export default function Toolbar() {
  const { isLoading, toggleDrawer } = useCommonContext();

  return (
    <Card
      sx={{
        backgroundColor: "#FFF",
        zIndex: 10,
        position: "fixed",
        width: { xs: "100vw", lg: "80vw" },
        top: 0,
        right: 0,
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
      </Box>
      {isLoading && <LinearProgress />}
    </Card>
  );
}
