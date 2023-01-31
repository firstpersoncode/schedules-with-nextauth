import { useState, useMemo } from "react";
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
import { Line } from "react-chartjs-2";
import { add, format, isAfter, isBefore, isWithinInterval } from "date-fns";
import { useAgendaContext } from "context/agenda";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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

export default function BurnDownChart() {
  const { agendas, labels, getEvents } = useAgendaContext();
  const [scale, setScale] = useState(scaleOptions[0].value);

  const events = getEvents();
  const checkedAgendas = useMemo(
    () => agendas.filter((a) => a.checked),
    [agendas]
  );

  const checkedLabels = useMemo(() => {
    return labels
      .filter(
        (e) => e.checked && checkedAgendas.find((a) => a.id === e.agendaId)
      )
      .map((e) => {
        if (!e.id) {
          const agenda = checkedAgendas.find((a) => a.id === e.agendaId);
          return { ...e, title: `${e.title} - ${agenda.title}` };
        }

        return e;
      });
  }, [labels, checkedAgendas]);

  const dateInterval = useMemo(() => {
    const arr = [];
    const sortedAgendasByStart = checkedAgendas.sort((a, b) => {
      return new Date(a.start) - new Date(b.start);
    });
    const sortedAgendasByEnd = checkedAgendas.sort((a, b) => {
      return new Date(a.end) - new Date(b.end);
    });

    let startAgenda = new Date(sortedAgendasByStart[0].start);
    let endAgenda = new Date(
      sortedAgendasByEnd[sortedAgendasByEnd.length - 1].end
    );

    const sortedEventsByStart = events.sort((a, b) => {
      return new Date(a.start) - new Date(b.start);
    });
    const firstEvent = sortedEventsByStart[0];
    const beforeAgenda = firstEvent
      ? isBefore(firstEvent.start, startAgenda)
      : false;
    if (beforeAgenda) startAgenda = firstEvent.start;

    const sortedEventsByEnd = events.sort((a, b) => {
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
  }, [checkedAgendas, events, scale]);

  const datasets = useMemo(() => {
    return checkedLabels.map((label) => {
      const eventsByLabel = events.filter((e) => {
        if (!label.id) return label.agendaId === e.agendaId && !e.labels.length;
        return e.labels.find((l) => l.id === label.id);
      });

      const data = dateInterval.arr.map((date) => {
        return eventsByLabel.filter((e) => {
          return (
            e.status.type === "COMPLETED" &&
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
  }, [dateInterval, events, checkedLabels]);

  const data = {
    labels: dateInterval.labels,
    datasets,
  };

  function handleScaleChange(e) {
    setScale(e.target.value);
  }

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
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
    </Box>
  );
}
