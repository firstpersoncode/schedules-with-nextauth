import {
  Toc,
  CalendarViewMonth,
  DateRange,
  Task,
  ViewDay,
  ViewWeek,
  Visibility,
  ControlPoint,
} from "@mui/icons-material";
import { Zoom, Fab, Box, Backdrop, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useAgendaContext } from "context/agenda";
import { useState } from "react";
import { Views } from "react-big-calendar";

export default function Action() {
  const { agendas, openTimeLineDialog, openEventDialog, selectView } =
    useAgendaContext();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [openView, setOpenView] = useState(false);

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  function handleClose() {
    setOpen(false);
    setOpenView(false);
  }

  function toggleAction() {
    setOpen(!open);
  }

  function toggleOpenView() {
    setOpenView(!openView);
  }

  function handleOpenTimeLineDialog() {
    openTimeLineDialog();
    handleClose();
  }

  function handleOpenEventDialog() {
    openEventDialog();
    handleClose();
  }

  function handleSelectView(selectedView) {
    return function () {
      selectView(selectedView);
      handleClose();
    };
  }

  return (
    <Box sx={{ position: "fixed", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Backdrop
        sx={{ color: "#fff" }}
        open={open || openView}
        onClick={handleClose}
      />

      <Zoom
        sx={{ position: "fixed", right: 30, bottom: 300 }}
        in={openView}
        timeout={transitionDuration}
        unmountOnExit
      >
        <Tooltip placement="left" title="Month">
          <Fab onClick={handleSelectView(Views.MONTH)} size="small">
            <CalendarViewMonth />
          </Fab>
        </Tooltip>
      </Zoom>
      <Zoom
        sx={{ position: "fixed", right: 30, bottom: 250 }}
        in={openView}
        timeout={transitionDuration}
        unmountOnExit
      >
        <Tooltip placement="left" title="Week">
          <Fab onClick={handleSelectView(Views.WEEK)} size="small">
            <ViewWeek />
          </Fab>
        </Tooltip>
      </Zoom>
      <Zoom
        sx={{ position: "fixed", right: 30, bottom: 200 }}
        in={openView}
        timeout={transitionDuration}
        unmountOnExit
      >
        <Tooltip placement="left" title="Day">
          <Fab onClick={handleSelectView(Views.DAY)} size="small">
            <ViewDay />
          </Fab>
        </Tooltip>
      </Zoom>
      <Zoom
        sx={{ position: "fixed", right: 30, bottom: 150 }}
        in={openView}
        timeout={transitionDuration}
        unmountOnExit
      >
        <Tooltip placement="left" title="Table">
          <Fab onClick={handleSelectView("table")} size="small">
            <Toc />
          </Fab>
        </Tooltip>
      </Zoom>

      <Tooltip placement="left" title="View">
        <Fab
          color="primary"
          sx={{
            position: "fixed",
            right: openView ? 30 : -15,
            transition: "all .3s ease-out",
            bottom: 100,
          }}
          onClick={toggleOpenView}
          size="small"
        >
          <Visibility />
        </Fab>
      </Tooltip>

      <Zoom
        sx={{ position: "fixed", right: 90, bottom: 90 }}
        in={open}
        timeout={transitionDuration}
        unmountOnExit
      >
        <Tooltip placement="left" title="Add timeline">
          <Fab
            disabled={!agendas.length}
            onClick={handleOpenTimeLineDialog}
            size="small"
          >
            <DateRange />
          </Fab>
        </Tooltip>
      </Zoom>

      <Zoom
        sx={{ position: "fixed", right: 110, bottom: 30 }}
        in={open}
        timeout={transitionDuration}
        unmountOnExit
      >
        <Tooltip placement="left" title="Add event">
          <Fab
            disabled={!agendas.length}
            onClick={handleOpenEventDialog}
            size="small"
          >
            <Task />
          </Fab>
        </Tooltip>
      </Zoom>

      <Tooltip placement="left" title="Actions">
        <Fab
          sx={{
            position: "fixed",
            right: open ? 30 : -25,
            bottom: 30,
            transition: "all .3s ease-out",
          }}
          color="primary"
          onClick={toggleAction}
        >
          <ControlPoint />
        </Fab>
      </Tooltip>
    </Box>
  );
}
