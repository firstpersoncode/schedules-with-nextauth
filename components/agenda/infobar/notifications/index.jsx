import { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Alert,
  AlertTitle,
  CardActionArea,
  Skeleton,
} from "@mui/material";
import {
  format,
  isBefore,
  isAfter,
  isToday,
  isTomorrow,
  isYesterday,
} from "date-fns";
import { useAgendaContext } from "context/agenda";
import Countdown from "./countdown";

export default function Notifications() {
  const { getEvents, openEventDialog } = useAgendaContext();
  const events = getEvents();
  const [loading, setLoading] = useState(true);
  const [missedEvents, setMissedEvents] = useState([]);
  const [inComingEvents, setInComingEvents] = useState([]);

  const missedChecker = useRef();
  const incomingChecker = useRef();
  const timeoutRef = useRef();

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
        .sort((a, b) => new Date(b.start) - new Date(a.start));

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
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (missedEvents.length > 0 || inComingEvents.length > 0) {
      setLoading(false);
    } else {
      timeoutRef.current = setTimeout(() => {
        setLoading(false);
      }, 1000);
    }

    () => timeoutRef.current && clearTimeout(timeoutRef.current);
  }, [missedEvents, inComingEvents]);

  return (
    <>
      {loading && (
        <>
          <Box sx={{ px: 2, my: 1, minWidth: "90%" }}>
            <Skeleton
              sx={{ p: 0, m: 0, transform: "unset" }}
              animation="wave"
              height="120px"
              width="100%"
            />
          </Box>
          <Box sx={{ px: 2, my: 1, minWidth: "90%" }}>
            <Skeleton
              sx={{ p: 0, m: 0, transform: "unset" }}
              animation="wave"
              height="120px"
              width="100%"
            />
          </Box>
          <Box sx={{ px: 2, my: 1, minWidth: "90%" }}>
            <Skeleton
              sx={{ p: 0, m: 0, transform: "unset" }}
              animation="wave"
              height="120px"
              width="100%"
            />
          </Box>
        </>
      )}

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
              sx={{ flex: 1, minWidth: "90%" }}
            >
              <Alert severity="error">
                <AlertTitle sx={{ fontSize: 12 }}>
                  Missed{" "}
                  {isToday(new Date(event.start))
                    ? "today"
                    : isYesterday(new Date(event.start))
                    ? "yesterday"
                    : `on ${format(
                        new Date(event.start),
                        "iiii, MMM dd yyyy"
                      )}`}
                </AlertTitle>
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
              sx={{ flex: 1, minWidth: "90%" }}
            >
              <Alert severity="warning">
                <AlertTitle sx={{ fontSize: 12 }}>
                  Incoming{" "}
                  {isToday(new Date(event.start))
                    ? "today"
                    : isTomorrow(new Date(event.start))
                    ? "tomorrow"
                    : `on ${format(
                        new Date(event.start),
                        "iiii, MMM dd yyyy"
                      )}`}
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
    </>
  );
}
