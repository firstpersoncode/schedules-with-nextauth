import { useState } from "react";
import dynamic from "next/dynamic";
import { Box, Popover } from "@mui/material";
import { startOfDay, isSameDay, isEqual } from "date-fns";
import { useAgendaContext } from "context/agenda";

const DayView = dynamic(() => import("./dayView"));

export default function DateCellWrapper({ children, ...props }) {
  const { selectDate, date } = useAgendaContext();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const d = new Date(props.value);

  const handleClick = (e) => {
    e.stopPropagation();
    const day = startOfDay(new Date(d));
    selectDate(day);
    setAnchorEl(e.currentTarget);
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        position: "relative",
        zIndex: 5,
        display: "flex",
        flex: 1,
        borderLeft: "1px solid #DDD",
        ...(isEqual(startOfDay(new Date(d)), startOfDay(new Date(date))) && {
          backgroundColor: "rgba(255, 238, 0, 0.1)",
        }),
        ...(isSameDay(startOfDay(new Date(d)), startOfDay(new Date())) && {
          backgroundColor: "rgba(0, 146, 255, 0.1)",
        }),
        "& .rbc-day-bg": { backgroundColor: "transparent" },
      }}
    >
      {children}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            width: { xs: "100vw", lg: "40vw" },
            height: 300,
            overflowY: "auto",

            "& .rbc-timeslot-group": { minHeight: 60 },
            "& .rbc-label": { fontSize: 10 },
            "& .rbc-event-label": { fontSize: 10 },
            "& .rbc-current-time-indicator": {
              backgroundColor: (theme) => theme.palette.primary.main,
            },
          },
        }}
      >
        {open && <DayView />}
      </Popover>
    </Box>
  );
}