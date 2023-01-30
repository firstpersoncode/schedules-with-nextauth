import { useCallback, useMemo, useState } from "react";
import {
  Box,
  FormControlLabel,
  Radio,
  TextField,
  MenuItem,
} from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { add, format, isAfter, isBefore } from "date-fns";
import { useAgendaContext } from "context/agenda";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const scaleOptions = [
  { title: "Months", value: "months" },
  { title: "Weeks", value: "weeks" },
];

const options = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
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

export default function CommitmentChart({ agenda }) {
  const { agenda: activeAgenda, getEvents, selectAgenda } = useAgendaContext();
  const [scale, setScale] = useState(scaleOptions[0].value);

  const allEvents = getEvents();

  const agendaEvents = useMemo(
    () => allEvents.filter((e) => e.agendaId === agenda.id),
    [allEvents, agenda]
  );

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

  const getData = useCallback(
    (type) => (date) => {
      let events = agendaEvents.filter((e) => {
        return isBefore(new Date(date), new Date(e.end));
      });

      if (type === "completed")
        events = events.filter((e) => e.status.type === "COMPLETED");

      return events.length;
    },
    [agendaEvents]
  );

  const data = {
    labels: dateInterval.labels,
    datasets: [
      {
        label: "Created",
        data: dateInterval.arr.map(getData("created")),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Completed",
        data: dateInterval.arr.map(getData("completed")),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  function handleScaleChange(e) {
    setScale(e.target.value);
  }

  function handleSelectAgenda() {
    selectAgenda(agenda);
  }

  return (
    <>
      <FormControlLabel
        sx={{ px: 2, mt: 2 }}
        onChange={handleSelectAgenda}
        control={
          <Radio
            sx={{
              color: agenda.color,
              "&.Mui-checked": {
                color: agenda.color,
              },
            }}
            checked={activeAgenda?.id === agenda.id}
          />
        }
        label={agenda.title}
      />
      <Box sx={{ px: 2, display: "flex", justifyContent: "flex-end" }}>
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
          <Bar options={options} data={data} />;
        </Box>
      </Box>
    </>
  );
}
