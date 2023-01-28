import { Box, MenuItem, TextField } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useAgendaContext } from "context/agenda";
import { add, format, isAfter, isBefore, isWithinInterval } from "date-fns";
import { useState } from "react";
import { useMemo } from "react";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const scaleOptions = [
  { title: "Weeks", value: "weeks" },
  { title: "Months", value: "months" },
];

const options = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
      reverse: true,
      ticks: {
        stepSize: 1,
      },
    },
    x: {
      beginAtZero: true,
    },
  },
  plugins: {
    legend: {
      position: "top",
    },
  },
};

export default function BurnDownChart({ agenda }) {
  const { labels, getEvents } = useAgendaContext();
  const [scale, setScale] = useState(scaleOptions[0].value);

  const allEvents = getEvents();

  const agendaEvents = useMemo(
    () => allEvents.filter((e) => e.agendaId === agenda.id),
    [allEvents, agenda]
  );

  const agendaLabels = useMemo(() => {
    const filteredLabels = labels
      .filter((e) => e.agendaId === agenda.id)
      .filter((e) => e.checked);
    filteredLabels.unshift({ title: "No label", color: "#ccc" });
    return filteredLabels;
  }, [labels, agenda]);

  const dateInterval = useMemo(() => {
    const arr = [];
    let startAgenda = new Date(agenda.start);
    let endAgenda = new Date(agenda.end);

    const sortedEventsByStart = agendaEvents.sort((a, b) => {
      return new Date(a.start) - new Date(b.start);
    });
    const firstEvent = sortedEventsByStart[0];
    const beforeAgenda = firstEvent
      ? isBefore(firstEvent.start, startAgenda)
      : false;
    if (beforeAgenda) startAgenda = firstEvent.start;

    const sortedEventsByEnd = agendaEvents.sort((a, b) => {
      return new Date(a.end) - new Date(b.end);
    });
    const lastEvent = sortedEventsByEnd[sortedEventsByEnd.length - 1];
    const afterAgenda = lastEvent ? isAfter(lastEvent.end, endAgenda) : false;
    if (afterAgenda) endAgenda = lastEvent.end;

    arr.push(startAgenda);

    let betweenAgenda = add(startAgenda, { [scale]: 1 });

    while (isBefore(betweenAgenda, endAgenda)) {
      arr.push(betweenAgenda);
      betweenAgenda = add(betweenAgenda, { [scale]: 1 });
    }

    arr.push(endAgenda);

    return {
      arr,
      labels: arr.map((week) => format(week, "MMM/dd/yyyy hh:mm a")),
    };
  }, [agenda.start, agenda.end, agendaEvents, scale]);

  const datasets = useMemo(() => {
    return agendaLabels.map((label) => {
      const eventsByLabel = agendaEvents.filter((e) => {
        if (!label.id) return !e.labels.length;
        return e.labels.find((l) => l.id === label.id);
      });

      const data = dateInterval.arr.map((date) => {
        return eventsByLabel.filter((e) => {
          return (
            e.status === "COMPLETED" &&
            isWithinInterval(new Date(e.end), {
              start: new Date(dateInterval.arr[0]),
              end: new Date(date),
            })
          );
        }).length;
      });

      return {
        label: label.title,
        data,
        borderColor: label.color,
        backgroundColor: label.color,
      };
    });
  }, [dateInterval, agendaEvents, agendaLabels]);

  const data = {
    labels: dateInterval.labels,
    datasets,
  };

  function handleScaleChange(e) {
    setScale(e.target.value);
  }

  return (
    <>
      <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
        <TextField
          select
          label="Scale"
          value={scale}
          onChange={handleScaleChange}
        >
          {scaleOptions.map((option, i) => (
            <MenuItem key={i} value={option.value}>
              {option.title}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Box sx={{ overflowX: "auto" }}>
        <Box sx={{ minWidth: 700 }}>
          <Line options={options} data={data} />
        </Box>
      </Box>
    </>
  );
}
