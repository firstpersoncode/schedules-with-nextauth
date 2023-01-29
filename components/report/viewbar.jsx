import { BarChart, DonutLarge, TrendingDown } from "@mui/icons-material";
import { Box, Button, Card, Divider, Tooltip } from "@mui/material";
import { useReportContext } from "context/report";

export default function Viewbar() {
  const { view, selectView } = useReportContext();

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
        <Tooltip title="Progress">
          <Button
            sx={{ borderRadius: 0 }}
            fullWidth
            size="small"
            variant={view.value === "progress" ? "contained" : undefined}
            onClick={handleSelectView("progress")}
          >
            <DonutLarge />
          </Button>
        </Tooltip>
        <Tooltip title="Commitment">
          <Button
            sx={{ borderRadius: 0 }}
            fullWidth
            size="small"
            variant={view.value === "commitment" ? "contained" : undefined}
            onClick={handleSelectView("commitment")}
          >
            <BarChart />
          </Button>
        </Tooltip>
        <Tooltip title="Burndown">
          <Button
            sx={{ borderRadius: 0 }}
            fullWidth
            size="small"
            variant={view.value === "burndown" ? "contained" : undefined}
            onClick={handleSelectView("burndown")}
          >
            <TrendingDown />
          </Button>
        </Tooltip>
      </Box>
    </Card>
  );
}
