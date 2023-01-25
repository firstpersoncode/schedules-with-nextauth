import { useState } from "react";
import {
  Box,
  IconButton,
  Button,
  Card,
  Typography,
  LinearProgress,
  Tooltip,
} from "@mui/material";

import {
  Adjust,
  ChevronLeft,
  ChevronRight,
  Info,
  Menu,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { add, format, isEqual, isToday, startOfDay, sub } from "date-fns";
import { useAgendaContext } from "context/agenda";

export default function Toolbar() {
  const { isLoading, view, date, selectDate, toggleDrawer, toggleInfoDrawer } =
    useAgendaContext();

  const [datePicker, setDatePicker] = useState(false);

  function toggleDatePicker() {
    setDatePicker(!datePicker);
  }

  function handleBackDate() {
    const d = sub(new Date(date), { [`${view.value}s`]: 1 });
    const today = isToday(d);
    if (today) selectDate(new Date());
    else selectDate(startOfDay(d));
  }

  function handleNextDate() {
    const d = add(new Date(date), { [`${view.value}s`]: 1 });
    const today = isToday(d);
    if (today) selectDate(new Date());
    else selectDate(startOfDay(d));
  }

  function handleSetToday() {
    const today = new Date();
    selectDate(today);
  }

  function handleSelectDate(v) {
    const today = isToday(new Date(v));
    if (today) selectDate(new Date());
    else selectDate(startOfDay(new Date(v)));
  }

  return (
    <Card
      sx={{
        backgroundColor: "#FFF",
        zIndex: 10,
        position: "fixed",
        width: { xs: "100vw", lg: "80vw" },
        top: 0,
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
        <IconButton
          size="small"
          sx={{ display: { xs: "block", lg: "none" }, lineHeight: 0 }}
          onClick={toggleDrawer}
        >
          <Menu />
        </IconButton>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={handleBackDate}>
            <ChevronLeft />
          </IconButton>
          <Tooltip title="Today">
            <Button
              onClick={handleSetToday}
              variant={
                isEqual(startOfDay(new Date()), startOfDay(new Date(date)))
                  ? "contained"
                  : "outlined"
              }
              size="small"
              sx={{ minWidth: "unset", p: 0, borderRadius: "50%" }}
            >
              <Adjust />
            </Button>
          </Tooltip>
          <IconButton onClick={handleNextDate}>
            <ChevronRight />
          </IconButton>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              open={datePicker}
              onOpen={toggleDatePicker}
              onClose={toggleDatePicker}
              size="small"
              value={date}
              closeOnSelect
              onChange={handleSelectDate}
              renderInput={({ inputRef }) => {
                return (
                  <Button
                    variant="contained"
                    ref={inputRef}
                    size="small"
                    onClick={toggleDatePicker}
                  >
                    <Typography sx={{ fontSize: 14 }}>
                      {format(new Date(date), "MMM dd, yyyy")}
                    </Typography>
                  </Button>
                );
              }}
            />
          </LocalizationProvider>
        </Box>

        <Tooltip placement="left" title="Info">
          <IconButton onClick={toggleInfoDrawer}>
            <Info />
          </IconButton>
        </Tooltip>
      </Box>
      {isLoading && <LinearProgress />}
    </Card>
  );
}
