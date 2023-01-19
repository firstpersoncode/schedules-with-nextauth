import {
  Box,
  Typography,
  Alert,
  AlertTitle,
  CardActionArea,
} from "@mui/material";
import Countdown from "components/countdown";
import { useProjectContext } from "context/project";
import {
  closestIndexTo,
  closestTo,
  format,
  isBefore,
  isAfter,
  isToday,
} from "date-fns";

import { useEffect, useRef, useState } from "react";

export default function IncomingEvents() {
  const { events, selectEvent, setIsEditingEvent, toggleEventDialog } =
    useProjectContext();
  const [inProgressEvent, setInProgressEvent] = useState(null);
  const [inComingEvent, setInComingEvent] = useState(null);
  const [missedEvent, setMissedEvent] = useState(null);

  const inProgressChecker = useRef();
  const incomingChecker = useRef();
  const missedChecker = useRef();

  const handleSelectEvent = (event) => () => {
    selectEvent(event);
    setIsEditingEvent(true);
    toggleEventDialog();
  };

  useEffect(() => {
    if (inProgressChecker.current) clearInterval(inProgressChecker.current);
    inProgressChecker.current = setInterval(() => {
      const now = new Date();
      const todoEvents = events.filter(
        (e) => e.status === "INPROGRESS" && isBefore(now, new Date(e.end))
      );

      const closestEventIndex = closestIndexTo(
        now,
        todoEvents.map((e) => new Date(e.start))
      );

      const event = todoEvents[closestEventIndex];

      setInProgressEvent(event);
    }, 1000);

    return () => clearInterval(inProgressChecker.current);
  }, [events]);

  useEffect(() => {
    if (incomingChecker.current) clearInterval(incomingChecker.current);
    incomingChecker.current = setInterval(() => {
      const now = new Date();
      const todoEvents = events.filter(
        (e) => e.status === "TODO" && isBefore(now, new Date(e.start))
      );

      const closestEventIndex = closestIndexTo(
        now,
        todoEvents.map((e) => new Date(e.start))
      );

      const event = todoEvents[closestEventIndex];

      setInComingEvent(event);
    }, 1000);

    return () => clearInterval(incomingChecker.current);
  }, [events]);

  useEffect(() => {
    if (missedChecker.current) clearInterval(missedChecker.current);
    missedChecker.current = setInterval(() => {
      const now = new Date();
      const todoEvents = events.filter(
        (e) =>
          e.status === "TODO" &&
          isAfter(now, new Date(e.start)) &&
          isBefore(now, new Date(e.end))
      );

      const closestEventIndex = closestIndexTo(
        now,
        todoEvents.map((e) => new Date(e.end))
      );

      const event = todoEvents[closestEventIndex];

      setMissedEvent(event);
    }, 1000);

    return () => clearInterval(missedChecker.current);
  }, [events]);

  return (
    <>
      {missedEvent?.start && (
        <CardActionArea onClick={handleSelectEvent(missedEvent)}>
          <Alert severity="error">
            <AlertTitle sx={{ fontSize: { xs: "16px", lg: "20px" } }}>
              Missed today
            </AlertTitle>
            <Typography
              sx={{ fontSize: { xs: "26px", lg: "30px", fontWeight: "500" } }}
            >
              {missedEvent.title}
            </Typography>
            <Typography>Ends at</Typography>
            <Countdown targetDate={new Date(missedEvent.end)} />
          </Alert>
        </CardActionArea>
      )}

      {inComingEvent?.start && (
        <CardActionArea onClick={handleSelectEvent(inComingEvent)}>
          <Alert severity="warning">
            <AlertTitle sx={{ fontSize: { xs: "16px", lg: "20px" } }}>
              Incoming{" "}
              {isToday(new Date(inComingEvent.start))
                ? "today"
                : `on ${format(new Date(inComingEvent.start), "iiii")}`}
            </AlertTitle>
            <Typography
              sx={{ fontSize: { xs: "26px", lg: "30px", fontWeight: "500" } }}
            >
              {inComingEvent.title}
            </Typography>
            <Typography>Started at</Typography>
            <Countdown targetDate={new Date(inComingEvent.start)} />
          </Alert>
        </CardActionArea>
      )}

      {inProgressEvent?.start && (
        <CardActionArea onClick={handleSelectEvent(inProgressEvent)}>
          <Alert severity="success">
            <AlertTitle sx={{ fontSize: { xs: "16px", lg: "20px" } }}>
              In Progress
            </AlertTitle>
            <Typography
              sx={{ fontSize: { xs: "26px", lg: "30px", fontWeight: "500" } }}
            >
              {inProgressEvent.title}
            </Typography>
            <Typography>Finished at</Typography>
            <Countdown targetDate={new Date(inProgressEvent.end)} />
          </Alert>
        </CardActionArea>
      )}
    </>
  );
}
