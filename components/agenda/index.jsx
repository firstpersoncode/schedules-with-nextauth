import { Box } from "@mui/material";
import dynamic from "next/dynamic";
import { useAgendaContext } from "context/agenda";
import SideBar from "./sidebar";
import Calendar from "./calendar";
import Toolbar from "./toolbar";
import InfoBar from "./infobar";
import Viewbar from "./viewbar";

const Event = dynamic(() => import("./event"));
const Dialog = dynamic(() => import("./dialog"));

export default function Agenda() {
  const { eventDialog, agendaDialog } = useAgendaContext();

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
          <Calendar />
          <Viewbar />
        </Box>
        <InfoBar />
      </Box>

      {eventDialog && <Event />}
      {agendaDialog && <Dialog />}
    </>
  );
}
