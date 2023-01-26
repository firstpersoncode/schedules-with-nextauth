import { useState } from "react";
import { Box } from "@mui/material";
import { startOfDay, isToday } from "date-fns";
import { useAgendaContext } from "context/agenda";
import { useGlobalContext } from "context/global";
import dynamic from "next/dynamic";

const FloatDayView = dynamic(() => import("./floatDayView"));

export default function TimeSlotWrapper({ children, ...props }) {
  const { isMobile } = useGlobalContext();
  const { selectDate, date } = useAgendaContext();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (e) => {
    e.stopPropagation();
    const day = new Date(props.value);
    selectDate(day);
    if (isMobile) setAnchorEl(e.currentTarget);
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        cursor: "pointer",
        position: "relative",
        zIndex: 5,
        // display: "flex",
        flex: 1,
        ...(isToday(startOfDay(new Date(props.value))) && {
          backgroundColor: "rgba(0, 146, 255, 0.05)",
        }),
        "& .rbc-day-bg": { backgroundColor: "transparent" },
      }}
    >
      {children}
      {open && (
        <FloatDayView
          date={props.value}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
        />
      )}
    </Box>
  );
}
