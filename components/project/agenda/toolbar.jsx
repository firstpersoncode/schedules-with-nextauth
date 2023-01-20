import {
  Box,
  TextField,
  IconButton,
  Button,
  Card,
  MenuItem,
  LinearProgress,
  Collapse,
} from "@mui/material";

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
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useProjectContext } from "context/project";
import { useRef, useState } from "react";
import Notifications from "../notifications";
import Report from "../report";
import useClickOutside from "hooks/useClickOutside";

export default function Toolbar() {
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
  } = useProjectContext();

  const [openInfo, setOpenInfo] = useState(false);

  const infoRef = useRef();
  useClickOutside(infoRef, () => setOpenInfo(false));

  function toggleInfo() {
    setOpenInfo(!openInfo);
  }

  function handleBackDate() {
    const d = sub(new Date(selectedDate), { [`${view.value}s`]: 1 });
    const min = startOfDay(new Date(agenda.start));
    if (isAfter(d, min)) {
      setSelectedDate(d);
    } else {
      setSelectedDate(min);
    }
  }

  function handleNextDate() {
    const d = add(new Date(selectedDate), { [`${view.value}s`]: 1 });
    if (agenda.end) {
      const max = endOfDay(new Date(agenda.end));
      if (isBefore(d, max)) {
        setSelectedDate(d);
      } else {
        setSelectedDate(max);
      }
    } else {
      setSelectedDate(d);
    }
  }

  function handleSetToday() {
    const today = new Date();
    setSelectedDate(today);
  }

  function handleSelectView(e) {
    const selectedView = views.find((p) => p.value === e.target.value);
    selectView(selectedView);
  }

  function handleChangeDate(v) {
    setSelectedDate(v);
  }

  return (
    <Card
      sx={{
        backgroundColor: "#FFF",
        zIndex: 10,
        position: "fixed",
        width: { xs: "100vw", lg: "80vw" },
        top: 40,
        right: 0,
      }}
    >
      <Box
        sx={{
          px: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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
            sx={{ minWidth: "unset", p: 0, borderRadius: "50%" }}
          >
            <Adjust />
          </Button>
          <IconButton onClick={handleNextDate}>
            <ChevronRight />
          </IconButton>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              size="small"
              value={selectedDate}
              closeOnSelect
              onChange={handleChangeDate}
              renderInput={(params) => (
                <TextField {...params} variant="standard" />
              )}
            />
          </LocalizationProvider>
        </Box>

        {/* {format(new Date(selectedDate), "MMM dd, yyyy")} */}

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            select
            variant="standard"
            size="small"
            value={view?.value || null}
            onChange={handleSelectView}
            fullWidth
            InputProps={{
              disableUnderline: true,
              sx: {
                "& .MuiSelect-select": {
                  p: 0,
                  flexDirection: "unset",
                  lineHeight: 0,
                },
              },
            }}
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

          <IconButton onClick={toggleInfo}>
            {openInfo ? <ExpandLess /> : <Info />}
          </IconButton>
        </Box>
      </Box>
      {loadingEvent && <LinearProgress />}

      <Collapse in={openInfo}>
        <Box ref={infoRef} sx={{ maxHeight: "50vh", overflowY: "auto" }}>
          <Notifications />
          <Report />
        </Box>
      </Collapse>
    </Card>
  );
}
