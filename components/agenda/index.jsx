import { Box } from "@mui/material";
import { useAgendaContext } from "context/agenda";
import SideBar from "./sidebar";
import Calendar from "./calendar";
import Toolbar from "./toolbar";
import dynamic from "next/dynamic";

const Event = dynamic(() => import("./event"));
const Dialog = dynamic(() => import("./dialog"));

export default function Agenda() {
  const { agendas, eventDialog, agendaDialog } = useAgendaContext();

  return (
    <>
      <Box
        sx={{
          display: "flex",
        }}
      >
        <SideBar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: "100vh",
            overflow: "hidden",
          }}
        >
          <Toolbar />
          {agendas.length > 0 && <Calendar />}
        </Box>
      </Box>

      {eventDialog && <Event />}
      {agendaDialog && <Dialog />}
    </>
  );
}
