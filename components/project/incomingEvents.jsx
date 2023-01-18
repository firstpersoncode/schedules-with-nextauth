import {
  Box,
  Typography,
  Alert,
  AlertTitle,
  CardActionArea,
} from "@mui/material";
import Countdown from "components/countdown";
import { useProjectContext } from "context/project";
import { closestIndexTo, closestTo, format, isBefore } from "date-fns";
import { useEffect, useRef, useState } from "react";
import getDayName from "utils/getDayName";

export default function IncomingEvents() {
  const { events } = useProjectContext();
  const [inComingEvent, setInComingEvent] = useState(null);
  const intervalId = useRef();

  useEffect(() => {
    if (intervalId.current) clearInterval(intervalId.current);
    intervalId.current = setInterval(() => {
      const now = new Date();
      const todoEvents = events.filter(
        (e) => e.status === "TODO" && isBefore(now, new Date(e.start))
      );

      const closestEventIndex = closestIndexTo(
        now,
        todoEvents.map((e) => new Date(e.start))
      );

      const event = todoEvents[closestEventIndex];

      if (event) {
        if (!inComingEvent) setInComingEvent(event);
        else if (inComingEvent.id !== event.id) setInComingEvent(event);
      }
    }, 1000);

    return () => clearInterval(intervalId.current);
  }, [events, inComingEvent]);

  return (
    <>
      <Box
        sx={{
          display: "grid",
          grid: {
            xs: "auto / auto",
            lg: "auto / repeat(2, 1fr)",
          },
          gap: 2,
          my: 2,
        }}
      >
        <CardActionArea>
          <Alert severity="success">
            <AlertTitle sx={{ fontSize: { xs: "16px", lg: "20px" } }}>
              In Progress
            </AlertTitle>
            <Typography
              sx={{ fontSize: { xs: "26px", lg: "30px", fontWeight: "500" } }}
            >
              Event title
            </Typography>
          </Alert>
        </CardActionArea>

        {inComingEvent?.start && (
          <CardActionArea>
            <Alert severity="warning">
              <AlertTitle sx={{ fontSize: { xs: "16px", lg: "20px" } }}>
                Incoming on {format(new Date(inComingEvent.start), "iiii")} |{" "}
                <Countdown targetDate={new Date(inComingEvent.start)} /> left
              </AlertTitle>
              <Typography
                sx={{ fontSize: { xs: "26px", lg: "30px", fontWeight: "500" } }}
              >
                {inComingEvent.title}
              </Typography>
            </Alert>
          </CardActionArea>
        )}
      </Box>

      {/* <Box
        sx={{
          display: "grid",
          grid: {
            xs: "repeat(2, 1fr) / repeat(2, 1fr)",
            lg: "auto / repeat(3, 1fr)",
          },
          gap: 2,
          my: 2,
        }}
      >
        <CardActionArea>
          <Alert severity="info">
            <AlertTitle sx={{ fontSize: { xs: "12px", lg: "14px" } }}>
              {getDayName("2023-01-16T12:02:50")} |{" "}
              <Countdown targetDate={"2023-01-16T12:02:50"} /> left
            </AlertTitle>
            <Typography
              sx={{ fontSize: { xs: "14px", lg: "16px", fontWeight: "500" } }}
            >
              Event title
            </Typography>
          </Alert>
        </CardActionArea>
        <CardActionArea>
          <Alert severity="info">
            <AlertTitle sx={{ fontSize: { xs: "12px", lg: "14px" } }}>
              {getDayName("2023-01-16T12:02:50")} |{" "}
              <Countdown targetDate={"2023-01-16T12:02:50"} /> left
            </AlertTitle>
            <Typography
              sx={{ fontSize: { xs: "14px", lg: "16px", fontWeight: "500" } }}
            >
              Event title
            </Typography>
          </Alert>
        </CardActionArea>
        <CardActionArea>
          <Alert severity="info">
            <AlertTitle sx={{ fontSize: { xs: "12px", lg: "14px" } }}>
              {getDayName("2023-01-16T12:02:50")} |{" "}
              <Countdown targetDate={"2023-01-16T12:02:50"} /> left
            </AlertTitle>
            <Typography
              sx={{ fontSize: { xs: "14px", lg: "16px", fontWeight: "500" } }}
            >
              Event title
            </Typography>
          </Alert>
        </CardActionArea>
      </Box> */}
    </>
  );
}
