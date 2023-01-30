import { useMemo } from "react";
import dynamic from "next/dynamic";
import { Box, Divider, Typography } from "@mui/material";
import { useReportContext } from "context/report";
import { useAgendaContext } from "context/agenda";

const BurnDownChart = dynamic(() => import("./burndownChart"));
const CommitmentChart = dynamic(() => import("./commitmentChart"));
const ProgressChart = dynamic(() => import("./progressChart"));

export default function Report() {
  const { view } = useReportContext();
  const { agendas } = useAgendaContext();

  const activeAgendas = useMemo(
    () => agendas.filter((a) => a.checked),
    [agendas]
  );

  return (
    <Box
      sx={{
        pt: "45px",
        height: "calc(100vh - 35px)",
        overflowY: "auto",
      }}
    >
      {view.value === "commitment" && activeAgendas.length > 0 && (
        <CommitmentChart />
      )}
      {view.value === "progress" &&
        activeAgendas.map((agenda, i) => (
          <Box key={i} sx={{ p: 2 }}>
            <Divider sx={{ my: 1 }}>
              <Typography sx={{ fontSize: 24 }}>{agenda.title}</Typography>
            </Divider>
            <ProgressChart agenda={agenda} />
          </Box>
        ))}
      {view.value === "burndown" && activeAgendas.length > 0 && (
        <BurnDownChart />
      )}
    </Box>
  );
}
