import { useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  Button,
  Card,
  MenuItem,
  Typography,
} from "@mui/material";

import {
  Adjust,
  CalendarViewDay,
  CalendarViewMonth,
  CalendarViewWeek,
  ChevronLeft,
  ChevronRight,
  ExpandLess,
  Info,
  Toc,
  Menu,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Views } from "react-big-calendar";
import { add, format, isEqual, startOfDay, sub } from "date-fns";
import { useAgendaContext } from "context/agenda";

export default function Toolbar() {
  const { views, view, selectView, date, selectDate, toggleDrawer } =
    useAgendaContext();

  const [datePicker, setDatePicker] = useState(false);

  function toggleDatePicker() {
    setDatePicker(!datePicker);
  }

  function handleBackDate() {
    const d = sub(new Date(date), { [`${view.value}s`]: 1 });
    selectDate(d);
  }

  function handleNextDate() {
    const d = add(new Date(date), { [`${view.value}s`]: 1 });
    selectDate(d);
  }

  function handleSetToday() {
    const today = new Date();
    selectDate(today);
  }

  function handleSelectDate(v) {
    selectDate(v);
  }

  function handleSelectView(e) {
    selectView(e.target.value);
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
          <IconButton onClick={handleNextDate}>
            <ChevronRight />
          </IconButton>
        </Box>

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
                <Button ref={inputRef} size="small" onClick={toggleDatePicker}>
                  <Typography sx={{ fontSize: 14 }}>
                    {format(new Date(date), "MMM dd, yyyy")}
                  </Typography>
                </Button>
              );
            }}
          />
        </LocalizationProvider>

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
                    table: <Toc />,
                  }[option.value]
                }
              </MenuItem>
            ))}
          </TextField>

          <IconButton>{false ? <ExpandLess /> : <Info />}</IconButton>
        </Box>
      </Box>
    </Card>
  );
}
