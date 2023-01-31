import { useMemo } from "react";
import { Box } from "@mui/material";
import { useAgendaContext } from "context/agenda";
import Board from "./board";

export default function View() {
  const { agendas } = useAgendaContext();
  const activeAgendas = useMemo(
    () => agendas.filter((a) => a.checked),
    [agendas]
  );

  return (
    <Box
      sx={{
        pt: "45px",
        height: "100%",
        overflowY: "auto",
      }}
    >
      {activeAgendas.map((agenda, i) => (
        <Board key={i} agenda={agenda} />
      ))}
    </Box>
  );
}
