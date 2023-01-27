import { useState } from "react";
import dynamic from "next/dynamic";
import { Box } from "@mui/material";
import { startOfDay, isToday, isSameDay } from "date-fns";
import { useAgendaContext } from "context/agenda";
import { useGlobalContext } from "context/global";

const TimeLineBar = dynamic(() => import("./timeLineBar"));
const FloatDayView = dynamic(() => import("./floatDayView"));

export default function DateCellWrapper({ children, ...props }) {
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
        flex: 1,
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          // zIndex: 5,
          ...(isSameDay(
            startOfDay(new Date(props.value)),
            startOfDay(new Date(date))
          )
            ? {
                border: "2px solid rgba(0, 146, 255, 1)",
              }
            : isToday(startOfDay(new Date(props.value)))
            ? {
                border: "1px solid #000",
              }
            : {
                border: "1px solid #CCC",
              }),
        }}
      >
        <TimeLineBar date={props.value} />
      </Box>

      <Box
        sx={{
          "& .rbc-day-bg": { backgroundColor: "transparent" },
        }}
      >
        {children}
      </Box>

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
