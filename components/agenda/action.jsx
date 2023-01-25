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
  const { openEventDialog, selectView } = useAgendaContext();
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
    if (openView) setOpenView(false);
  }

  function toggleOpenView() {
    setOpenView(!openView);
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
      <Backdrop sx={{ color: "#fff" }} open={open} onClick={handleClose} />

      <Zoom
        sx={{ position: "fixed", right: 30, bottom: 310 }}
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
        sx={{ position: "fixed", right: 30, bottom: 260 }}
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
        sx={{ position: "fixed", right: 30, bottom: 210 }}
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
        sx={{ position: "fixed", right: 30, bottom: 160 }}
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

      <Zoom
        sx={{ position: "fixed", right: 30, bottom: 110 }}
        in={open}
        timeout={transitionDuration}
        unmountOnExit
      >
        <Tooltip placement="left" title="View">
          <Fab color="primary" onClick={toggleOpenView} size="small">
            <Visibility />
          </Fab>
        </Tooltip>
      </Zoom>

      <Zoom
        sx={{ position: "fixed", right: 90, bottom: 90 }}
        in={open}
        timeout={transitionDuration}
        unmountOnExit
      >
        <Tooltip placement="left" title="Add timeline">
          <Fab color="primary" size="small">
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
          <Fab color="primary" onClick={handleOpenEventDialog} size="small">
            <Task />
          </Fab>
        </Tooltip>
      </Zoom>

      <Tooltip title="Actions">
        <Fab
          sx={{ position: "fixed", right: 30, bottom: 30 }}
          color="primary"
          onClick={toggleAction}
        >
          <ControlPoint />
        </Fab>
      </Tooltip>
    </Box>
  );
}
