import dynamic from "next/dynamic";
import { Box } from "@mui/material";
import { useCommonContext } from "context/common";
import ReportContextProvider from "context/report";
import AgendaContextProvider from "context/agenda";
import Meta from "components/meta";

import Toolbar from "./toolbar";
import View from "./view";
import Viewbar from "./viewbar";

const Drawer = dynamic(() => import("components/drawer"));
const InfoDrawer = dynamic(() => import("components/infoDrawer"));
const Event = dynamic(() => import("components/event"));
const Agenda = dynamic(() => import("components/agenda"));

function ReportLayout() {
  const { isMobile, eventDialog, agendaDialog, drawer, infoDrawer } =
    useCommonContext();

  return (
    <>
      <Meta title="Report" index={false} />
      <Box
        sx={{
          display: "flex",
        }}
      >
        {isMobile ? drawer && <Drawer /> : <Drawer />}
        <Box
          component="main"
          sx={{
            flex: 1,
            height: "100vh",
            overflow: "hidden",
          }}
        >
          <Toolbar />
          <View />
          <Viewbar />
        </Box>
        {infoDrawer && <InfoDrawer />}
      </Box>
      {eventDialog && <Event />}
      {agendaDialog && <Agenda />}
    </>
  );
}

export default function Report() {
  return (
    <AgendaContextProvider>
      <ReportContextProvider>
        <ReportLayout />
      </ReportContextProvider>
    </AgendaContextProvider>
  );
}
