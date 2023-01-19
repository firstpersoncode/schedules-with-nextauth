import Typography from "@mui/material/Typography";
import { useState, useEffect, useRef } from "react";

function calculateTimeLeft(targetDate) {
  const difference = +new Date(targetDate) - +new Date();
  let timeLeft = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
}

export default function Countdown({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));
  const intervalId = useRef();

  useEffect(() => {
    intervalId.current = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(intervalId.current);
  }, []);

  return (
    <Typography sx={{ fontSize: 12 }}>
      {String(timeLeft.days)} {timeLeft.days > 1 ? "days" : "day"},{" "}
      {timeLeft.hours} {timeLeft.hours > 1 ? "hours" : "hour"},{" "}
      {timeLeft.minutes} {timeLeft.minutes > 1 ? "minutes" : "minute"},{" "}
      {timeLeft.seconds} {timeLeft.seconds > 1 ? "seconds" : "second"}
    </Typography>
  );
}
