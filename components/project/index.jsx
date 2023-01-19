import {
  Box,
  Autocomplete,
  TextField,
  Toolbar,
  LinearProgress,
  IconButton,
  ButtonGroup,
  Button,
  Collapse,
  Card,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { useProjectContext } from "context/project";
import {
  ChevronLeft,
  ChevronRight,
  Event,
  ExpandLess,
  Info,
  Toc,
} from "@mui/icons-material";
import { Views } from "react-big-calendar";
import {
  add,
  endOfDay,
  isAfter,
  isBefore,
  isEqual,
  startOfDay,
  sub,
} from "date-fns";
import TopBar from "./topbar";
import SideBar from "./sidebar";
import IncomingEvents from "./incomingEvents";
import EventDialog from "./eventDialog";
import ProjectDialog from "./projectDialog";
import AgendaDialog from "./agendaDialog";
import DayView from "./dayView";
import WeekView from "./weekView";
import MonthView from "./monthView";
import Table from "./table";
import ProgressChart from "./progressChart";
import BurnDownChart from "./burndownChart";

export default function Project() {
  const {
    agenda,
    loadingEvent,
    views,
    view,
    selectView,
    isTable,
    toggleIsTable,
    selectedDate,
    setSelectedDate,
  } = useProjectContext();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openReport, setOpenReport] = useState(false);

  function handleOpenDrawer() {
    setOpenDrawer(true);
  }

  function handleCloseDrawer() {
    setOpenDrawer(false);
  }

  function handleBackDate() {
    const d = sub(new Date(selectedDate), { [`${view.value}s`]: 1 });
    const min = startOfDay(new Date(agenda.start));
    if (isAfter(d, min)) setSelectedDate(d);
    else setSelectedDate(min);
  }

  function handleNextDate() {
    const d = add(new Date(selectedDate), { [`${view.value}s`]: 1 });
    if (agenda.end) {
      const max = endOfDay(new Date(agenda.end));
      if (isBefore(d, max)) setSelectedDate(d);
      else setSelectedDate(max);
    } else setSelectedDate(d);
  }

  function handleSetToday() {
    setSelectedDate(new Date());
  }

  function handleSelectView(e) {
    const selectedView = views.find((p) => p.value === e.target.value);
    selectView(selectedView);
  }

  function toggleReport() {
    setOpenReport(!openReport);
  }

  return (
    <>
      <TopBar
        name="Default"
        open={openDrawer}
        onOpen={handleOpenDrawer}
        onClose={handleCloseDrawer}
      />
      <Box sx={{ display: "flex" }}>
        <SideBar
          open={openDrawer}
          onOpen={handleOpenDrawer}
          onClose={handleCloseDrawer}
        />
        <Box
          component="main"
          sx={{ flexGrow: 1, height: "100vh", overflowY: "auto" }}
        >
          <Toolbar />
          {loadingEvent && <LinearProgress />}
          <IncomingEvents />

          <Card
            sx={{
              backgroundColor: "#FFF",
              zIndex: 10,
              position: "sticky",
              top: { xs: 55, lg: 60 },
            }}
          >
            <Box sx={{ maxHeight: 300, overflowY: "auto" }}>
              <Collapse in={openReport}>
                <Box>
                  <ProgressChart />
                  <BurnDownChart />
                </Box>
              </Collapse>
            </Box>

            <Box
              sx={{
                p: 1,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <IconButton onClick={handleBackDate}>
                  <ChevronLeft />
                </IconButton>
                <ButtonGroup>
                  <Button
                    onClick={handleSetToday}
                    variant={
                      isEqual(
                        startOfDay(new Date()),
                        startOfDay(new Date(selectedDate))
                      )
                        ? "contained"
                        : "outlined"
                    }
                    size="small"
                  >
                    Today
                  </Button>
                </ButtonGroup>
                <IconButton onClick={handleNextDate}>
                  <ChevronRight />
                </IconButton>
              </Box>

              <Box sx={{ display: "flex", minWidth: 200 }}>
                <TextField
                  select
                  label="View"
                  variant="outlined"
                  size="small"
                  value={view?.value || null}
                  onChange={handleSelectView}
                  fullWidth
                >
                  {views.map((option, i) => (
                    <MenuItem key={i} value={option.value}>
                      {option.title}
                    </MenuItem>
                  ))}
                </TextField>

                <IconButton onClick={toggleIsTable}>
                  {isTable ? <Event /> : <Toc />}
                </IconButton>
                <IconButton onClick={toggleReport}>
                  {openReport ? <ExpandLess /> : <Info />}
                </IconButton>
              </Box>
            </Box>
          </Card>

          {agenda?.id && (
            <Box sx={{ opacity: loadingEvent ? "0.3" : "1" }}>
              <Box
                sx={{
                  display:
                    !isTable && view.value === Views.DAY ? "block" : "none",
                }}
              >
                <DayView />
              </Box>

              <Box
                sx={{
                  display:
                    !isTable && view.value === Views.WEEK ? "block" : "none",
                }}
              >
                <WeekView />
              </Box>

              <Box
                sx={{
                  display:
                    !isTable && view.value === Views.MONTH ? "block" : "none",
                }}
              >
                <MonthView />
              </Box>

              <Box
                sx={{
                  display: isTable ? "block" : "none",
                }}
              >
                <Table />
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      <ProjectDialog />
      <AgendaDialog />
      <EventDialog />
    </>
  );
}
