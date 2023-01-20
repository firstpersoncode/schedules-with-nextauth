import {
  Box,
  Typography,
  Alert,
  AlertTitle,
  CardActionArea,
} from "@mui/material";
import { useProjectContext } from "context/project";
import { format, isBefore, isAfter, isToday } from "date-fns";
import { useEffect, useRef, useState } from "react";
import Countdown from "./countdown";

export default function Notifications() {
  const { events, selectEvent, setIsEditingEvent, toggleEventDialog } =
    useProjectContext();
  const [missedEvents, setMissedEvents] = useState([]);
  const [inComingEvents, setInComingEvents] = useState([]);
  const [inProgressEvents, setInProgressEvents] = useState([]);

  const missedChecker = useRef();
  const incomingChecker = useRef();
  const inProgressChecker = useRef();

  const handleSelectEvent = (event) => () => {
    selectEvent(event);
    setIsEditingEvent(true);
    toggleEventDialog();
  };

  useEffect(() => {
    if (missedChecker.current) clearInterval(missedChecker.current);
    missedChecker.current = setInterval(() => {
      const now = new Date();
      const data = events
        .filter(
          (e) =>
            e.status === "TODO" &&
            isAfter(now, new Date(e.start)) &&
            isBefore(now, new Date(e.end))
        )
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
        sx={{
          width: "100%",
          overflowX: "auto",
          display: "flex",
          alignItems: "stretch",
          flexWrap: "nowrap",
          gap: 1,
        }}
      >
        {missedEvents.map((event, i) => (
          <CardActionArea
            key={`missed-${i}`}
            onClick={handleSelectEvent(event)}
            sx={{ flex: 1, minWidth: { xs: "80vw", lg: "70vw" } }}
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
      <Box
        sx={{
          width: "100%",
          overflowX: "auto",
          display: "flex",
          alignItems: "stretch",
          flexWrap: "nowrap",
          gap: 1,
        }}
      >
        {inComingEvents.map((event, i) => (
          <CardActionArea
            key={`incoming-${i}`}
            onClick={handleSelectEvent(event)}
            sx={{ flex: 1, minWidth: { xs: "80vw", lg: "70vw" } }}
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

      <Box
        sx={{
          width: "100%",
          overflowX: "auto",
          display: "flex",
          alignItems: "stretch",
          flexWrap: "nowrap",
          gap: 1,
        }}
      >
        {inProgressEvents.map((event, i) => (
          <CardActionArea
            key={`inprogress-${i}`}
            onClick={handleSelectEvent(event)}
            sx={{ flex: 1, minWidth: { xs: "80vw", lg: "70vw" } }}
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
    </>
  );
}
