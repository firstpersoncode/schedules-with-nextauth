import { useState, useMemo } from "react";
import {
  Box,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { useAgendaContext } from "context/agenda";
import formatDateRange from "utils/formatDateRange";
import Board from "./board";

export default function Cards() {
  const { agendas } = useAgendaContext();
  const activeAgendas = useMemo(
    () => agendas.filter((a) => a.checked),
    [agendas]
  );

  const [expanded, setExpanded] = useState(0);

  const handleChange = (panel) => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box sx={{ p: 2, pt: "45px", height: "100%", overflowY: "auto" }}>
      {activeAgendas.map((agenda, i) => (
        <Accordion key={i} expanded={expanded === i} onChange={handleChange(i)}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box
              sx={{ flex: 1, display: "flex", gap: 2, alignItems: "center" }}
            >
              <Typography>{agenda.title}</Typography>
              <Typography sx={{ color: "text.secondary", fontSize: 12 }}>
                {formatDateRange(agenda.start, agenda.end)}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              width: "100%",
              overflowX: "auto",
              p: 2,
            }}
          >
            <Board agenda={agenda} />
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
