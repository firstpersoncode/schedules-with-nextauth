import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { ExpandLess, ExpandMore, Troubleshoot } from "@mui/icons-material";
import {
  Box,
  Tab,
  Tabs,
  Typography,
  IconButton,
  Collapse,
  Divider,
} from "@mui/material";
import { useAgendaContext } from "context/agenda";

const BurnDownChart = dynamic(() => import("./burndownChart"));
const ProgressChart = dynamic(() => import("./progressChart"));

export default function Report() {
  const { agendas } = useAgendaContext();
  const [open, setOpen] = useState(true);
  const [tab, setTab] = useState(0);

  const activeAgendas = useMemo(
    () => agendas.filter((a) => a.checked),
    [agendas]
  );

  function toggleOpen() {
    setOpen(!open);
  }

  const handleChangeTab = (_, v) => {
    setTab(v);
  };

  return (
    <>
      <Box
        onClick={toggleOpen}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 1,
          px: 2,
          py: 1,
          cursor: "pointer",
        }}
      >
        <IconButton>
          <Troubleshoot />
        </IconButton>
        <IconButton size="small">
          {open ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>

      <Collapse in={open}>
        <Tabs value={tab} onChange={handleChangeTab}>
          <Tab label="Progress" />
          <Tab label="Burndown" />
        </Tabs>

        {tab === 0 &&
          activeAgendas.map((agenda, i) => (
            <ProgressChart key={i} agenda={agenda} />
          ))}
        {tab === 1 &&
          activeAgendas.map((agenda, i) => (
            <Box key={i}>
              <Typography sx={{ px: 2, mt: 2 }}>{agenda.title}</Typography>
              <BurnDownChart agenda={agenda} />
            </Box>
          ))}
      </Collapse>
      <Divider />
    </>
  );
}
