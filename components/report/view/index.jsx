import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Box } from "@mui/material";
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
        pt: "40px",
        height: "calc(100vh - 40px)",
        overflowY: "auto",
      }}
    >
      {view.value === "progress" &&
        activeAgendas.map((agenda, i) => (
          <ProgressChart key={i} agenda={agenda} />
        ))}
      {view.value === "commitment" &&
        activeAgendas.map((agenda, i) => (
          <CommitmentChart key={i} agenda={agenda} />
        ))}
      {view.value === "burndown" &&
        activeAgendas.map((agenda, i) => (
          <BurnDownChart key={i} agenda={agenda} />
        ))}
    </Box>
  );
}
