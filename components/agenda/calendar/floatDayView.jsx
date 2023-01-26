import dynamic from "next/dynamic";
import { Close } from "@mui/icons-material";
import { Box, IconButton, Popover, Typography } from "@mui/material";
import { format } from "date-fns";

const DayView = dynamic(() => import("./dayView"));

export default function FloatDayView({ date, open, anchorEl, onClose }) {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      PaperProps={{
        sx: {
          width: { xs: "100vw", lg: "40vw" },
          height: "60vh",
          overflow: "hidden",

          "& .rbc-timeslot-group": { minHeight: 60 },
          "& .rbc-label": { fontSize: 10 },
          "& .rbc-event-label": { fontSize: 10 },
          "& .rbc-current-time-indicator": {
            backgroundColor: (theme) => theme.palette.primary.main,
          },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
        }}
      >
        <Typography sx={{ px: 1, fontSize: 12 }}>
          {format(new Date(date), "MMM dd, yyyy")}
        </Typography>
        <IconButton sx={{ p: 1 }} size="small" onClick={onClose}>
          <Close />
        </IconButton>
      </Box>
      <Box
        className="dayView"
        sx={{ pt: "40px", height: "60vh", overflowY: "auto" }}
      >
        {open && <DayView />}
      </Box>
    </Popover>
  );
}
