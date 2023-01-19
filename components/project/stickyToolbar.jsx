import {
  Box,
  TextField,
  IconButton,
  Button,
  Collapse,
  Card,
  MenuItem,
  LinearProgress,
} from "@mui/material";
import { useProjectContext } from "context/project";
import {
  Adjust,
  CalendarViewDay,
  CalendarViewMonth,
  CalendarViewWeek,
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

import Report from "./report";

export default function StickyToolbar() {
  const {
    agenda,
    views,
    view,
    selectView,
    isTable,
    toggleIsTable,
    selectedDate,
    setSelectedDate,
    loadingEvent,
    isReport,
    toggleReport,
  } = useProjectContext();

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

  return (
    <Card
      sx={{
        backgroundColor: "#FFF",
        zIndex: 10,
        position: "sticky",
        top: { xs: 55, lg: 60 },
      }}
    >
      <Box
        sx={{
          p: 1,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={handleBackDate}>
            <ChevronLeft />
          </IconButton>
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
            <Adjust />
          </Button>
          <IconButton onClick={handleNextDate}>
            <ChevronRight />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex" }}>
          <TextField
            select
            variant="outlined"
            size="small"
            value={view?.value || null}
            onChange={handleSelectView}
            fullWidth
          >
            {views.map((option, i) => (
              <MenuItem key={i} value={option.value}>
                {
                  {
                    [Views.DAY]: <CalendarViewDay />,
                    [Views.WEEK]: <CalendarViewWeek />,
                    [Views.MONTH]: <CalendarViewMonth />,
                  }[option.value]
                }
              </MenuItem>
            ))}
          </TextField>

          <IconButton onClick={toggleIsTable}>
            {isTable ? <Event /> : <Toc />}
          </IconButton>
          <IconButton onClick={toggleReport}>
            {isReport ? <ExpandLess /> : <Info />}
          </IconButton>
        </Box>
      </Box>
      {loadingEvent && <LinearProgress />}
      <Report />
    </Card>
  );
}
