import { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Alert,
  AlertTitle,
  CardActionArea,
  Collapse,
  IconButton,
  Divider,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { format, isBefore, isAfter, isToday } from "date-fns";
import { useAgendaContext } from "context/agenda";
import Countdown from "./countdown";

export default function Notifications() {
  const { getEvents, openEventDialog } = useAgendaContext();
  const events = getEvents();
  const [open, setOpen] = useState(true);
  const [missedEvents, setMissedEvents] = useState([]);
  const [inComingEvents, setInComingEvents] = useState([]);
  const [inProgressEvents, setInProgressEvents] = useState([]);

  const missedChecker = useRef();
  const incomingChecker = useRef();
  const inProgressChecker = useRef();

  function toggleOpen() {
    setOpen(!open);
  }

  function handleSelectEvent(event) {
    return function () {
      openEventDialog({ start: event.start, end: event.end }, event);
    };
  }

  useEffect(() => {
    if (missedChecker.current) clearInterval(missedChecker.current);
    missedChecker.current = setInterval(() => {
      const now = new Date();
      const data = events
        // .filter(
        //   (e) =>
        //     e.status === "TODO" &&
        //     isAfter(now, new Date(e.start)) &&
        //     isBefore(now, new Date(e.end))
        // )
        .filter((e) => e.status === "TODO" && isAfter(now, new Date(e.start)))
        .sort((a, b) => new Date(a.start) - new Date(b.start));

      setMissedEvents(data);
    }, 1000);

    return () => clearInterval(missedChecker.current);
  }, [events]);

  useEffect(() => {
    if (incomingChecker.current) clearInterval(incomingChecker.current);
    incomingChecker.current = setInterval(() => {
      const now = new Date();
      const data = events
        .filter((e) => e.status === "TODO" && isBefore(now, new Date(e.start)))
        .sort((a, b) => new Date(a.start) - new Date(b.start));

      setInComingEvents(data);
    }, 1000);

    return () => clearInterval(incomingChecker.current);
  }, [events]);

  useEffect(() => {
    if (inProgressChecker.current) clearInterval(inProgressChecker.current);
    inProgressChecker.current = setInterval(() => {
      const now = new Date();
      const data = events
        .filter(
          (e) => e.status === "INPROGRESS" && isBefore(now, new Date(e.end))
        )
        .sort((a, b) => new Date(a.start) - new Date(b.start));

      setInProgressEvents(data);
    }, 1000);

    return () => clearInterval(inProgressChecker.current);
  }, [events]);

  return (
    <>
      <Box
        onClick={toggleOpen}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          px: 2,
          py: 1,
          cursor: "pointer",
        }}
      >
        <Typography>Notifications</Typography>
        <IconButton onClick={toggleOpen} size="small">
          {open ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>

      <Collapse in={open}>
        {missedEvents.length > 0 && (
          <Box
            sx={{
              width: "100%",
              overflowX: "auto",
              display: "flex",
              alignItems: "stretch",
              flexWrap: "nowrap",
              gap: 1,
              px: 2,
              my: 1,
            }}
          >
            {missedEvents.map((event, i) => (
              <CardActionArea
                key={`missed-${i}`}
                onClick={handleSelectEvent(event)}
                sx={{ flex: 1, minWidth: "80%" }}
              >
                <Alert severity="error">
                  <AlertTitle>Missed today</AlertTitle>
                  <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                    {event.title}
                  </Typography>
                  <Typography sx={{ fontSize: 12 }}>Ends at</Typography>
                  <Countdown targetDate={new Date(event.end)} />
                </Alert>
              </CardActionArea>
            ))}
          </Box>
        )}
        {inComingEvents.length > 0 && (
          <Box
            sx={{
              width: "100%",
              overflowX: "auto",
              display: "flex",
              alignItems: "stretch",
              flexWrap: "nowrap",
              gap: 1,
              px: 2,
              my: 1,
            }}
          >
            {inComingEvents.map((event, i) => (
              <CardActionArea
                key={`incoming-${i}`}
                onClick={handleSelectEvent(event)}
                sx={{ flex: 1, minWidth: "80%" }}
              >
                <Alert severity="warning">
                  <AlertTitle>
                    Incoming{" "}
                    {isToday(new Date(event.start))
                      ? "today"
                      : `on ${format(new Date(event.start), "iiii")}`}
                  </AlertTitle>
                  <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                    {event.title}
                  </Typography>
                  <Typography sx={{ fontSize: 12 }}>Started at</Typography>
                  <Countdown targetDate={new Date(event.start)} />
                </Alert>
              </CardActionArea>
            ))}
          </Box>
        )}
        {inProgressEvents.length > 0 && (
          <Box
            sx={{
              width: "100%",
              overflowX: "auto",
              display: "flex",
              alignItems: "stretch",
              flexWrap: "nowrap",
              gap: 1,
              px: 2,
              my: 1,
            }}
          >
            {inProgressEvents.map((event, i) => (
              <CardActionArea
                key={`inprogress-${i}`}
                onClick={handleSelectEvent(event)}
                sx={{ flex: 1, minWidth: "80%" }}
              >
                <Alert severity="success">
                  <AlertTitle>In Progress</AlertTitle>
                  <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                    {event.title}
                  </Typography>
                  <Typography sx={{ fontSize: 12 }}>Finished at</Typography>
                  <Countdown targetDate={new Date(event.end)} />
                </Alert>
              </CardActionArea>
            ))}
          </Box>
        )}
      </Collapse>

      <Divider />
    </>
  );
}
