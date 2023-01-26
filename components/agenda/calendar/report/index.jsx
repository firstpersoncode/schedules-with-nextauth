import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Box, Tab, Tabs, Typography, Divider   } from "@mui/material";
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

  const handleChangeTab = (_, v) => {
    setTab(v);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChangeTab}>
        <Tab label="Progress" />
        <Tab label="Burndown" />
      </Tabs>

      <Divider />

      <Box sx={{ height: "calc(100vh - 75px)", pb: "75px", overflowY: "auto" }}>
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
      </Box>
    </>
  );
}
