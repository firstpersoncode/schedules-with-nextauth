import { TableChart, TableRows } from "@mui/icons-material";
import { Box, Button, Card, Divider, Tooltip } from "@mui/material";
import { useBoardContext } from "context/board";

export default function Viewbar() {
  const { view, selectView } = useBoardContext();

  function handleSelectView(selectedView) {
    return function () {
      selectView(selectedView);
    };
  }

  return (
    <Card
      sx={{
        backgroundColor: "#FFF",
        zIndex: 10,
        position: "fixed",
        width: { xs: "100vw", lg: "80vw" },
        bottom: 0,
        right: 0,
      }}
    >
      <Divider />
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Tooltip title="Cards">
          <Button
            sx={{ borderRadius: 0 }}
            fullWidth
            size="small"
            variant={view.value === "cards" ? "contained" : undefined}
            onClick={handleSelectView("cards")}
          >
            <TableChart />
          </Button>
        </Tooltip>
        <Tooltip title="Table">
          <Button
            sx={{ borderRadius: 0 }}
            fullWidth
            size="small"
            variant={view.value === "table" ? "contained" : undefined}
            onClick={handleSelectView("table")}
          >
            <TableRows />
          </Button>
        </Tooltip>
      </Box>
    </Card>
  );
}
