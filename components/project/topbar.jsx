import { AccountCircle, Close, Menu } from "@mui/icons-material";
import {
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  Tooltip,
  Avatar,
  Box,
  Chip,
} from "@mui/material";
import { useProjectContext } from "context/project";
import { useSessionContext } from "context/session";
import {
  differenceInCalendarMonths,
  differenceInDays,
  differenceInWeeks,
  differenceInYears,
} from "date-fns";

function timeLeft(startDate, endDate) {
  const years = differenceInYears(endDate, startDate);
  const months = differenceInCalendarMonths(endDate, startDate);
  const weeks = differenceInWeeks(endDate, startDate);
  const days = differenceInDays(endDate, startDate);

  if (years > 0) {
    return `${years} ${years > 1 ? "years" : "year"} left`;
  }

  if (months > 0) {
    return `${months} ${months > 1 ? "months" : "month"} left`;
  }

  if (weeks > 0) {
    return `${weeks} ${weeks > 1 ? "weeks" : "week"} left`;
  }

  return `${days} ${days > 1 ? "days" : "day"} left`;
}

export default function TopBar({ open, onOpen, onClose }) {
  const { user } = useSessionContext();
  const { project, agenda } = useProjectContext();

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        "& .MuiToolbar-root": { minHeight: "unset", px: 1 },
      }}
    >
      <Toolbar>
        <IconButton
          size="small"
          edge="start"
          color="inherit"
          sx={{ display: { xs: "block", lg: "none" } }}
          onClick={open ? onClose : onOpen}
        >
          {open ? <Close /> : <Menu />}
        </IconButton>
        <Box
          sx={{
            flexGrow: 1,
            px: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="h6" component="div">
            {`${project?.title || ""} ${
              agenda?.title ? ` - ${agenda.title}` : ""
            }`}
          </Typography>
          {agenda?.end && (
            <Chip
              size="small"
              sx={{ color: "inherit" }}
              label={timeLeft(new Date(agenda.start), new Date(agenda.end))}
            />
          )}
        </Box>
        <Tooltip title="Profile">
          <IconButton>
            {user.image ? (
              <Avatar alt="Profile" src={user.image} />
            ) : (
              <AccountCircle />
            )}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
